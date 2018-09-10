import Vue from "vue";
import {getSinceDateFromDateType, getUntilDateFromDateType} from "../../helpers";
import axios from "axios";

/**
 * Commits in loading progress. For detecting duplication.
 *
 * @type {{}}
 */
let loadedCommits = {};

/**
 * How many request send
 *
 * @type {number}
 */
let loadingProcessCount = 0;

export default {
    state: {
        user: '',
        avatarUrl: '',
        repositories: {},

        errors: [],
        loadingProcess: false
    },
    mutations: {
        setUser(state, {login, avatarUrl}) {
            state.user = login;
            state.avatarUrl = avatarUrl;
        },
        setLoadingProcess(state, status) {
            state.loadingProcess = status;
        },
        setError(state, error) {
            if (typeof error === 'undefined') {
                state.errors = '';
                return;
            }

            let errorText = [];
            if (error.hasOwnProperty('data') && error.data.hasOwnProperty('message')) {
                errorText.push(error.data.message);
            }

            if (error.hasOwnProperty('response')) {
                errorText.push(error.message);
            }

            if (error.hasOwnProperty('message')) {
                errorText.push(error.response.data.message);
            }

            state.errors = errorText;
        },
        setRepository(state, {repository, since}) {
            const nameWithOwner = repository.nameWithOwner;

            //region repository.refs.edges
            let branches = {};
            repository.refs.edges.forEach(branch => {
                const item = {
                    name: branch.node.name,
                    commits: [],
                    hasDuplicateCommits: false,

                };
                Vue.set(branches, branch.node.name, item);
            });
            //endregion

            //region repository.pullRequests.edges
            let pullRequests = {};
            repository.pullRequests.edges.forEach(pullRequest => {
                const mergedAt = pullRequest.node.mergedAt;
                const mergedAtTime = (new Date(mergedAt)).getTime();

                //Merged earlier then since date.
                if (mergedAtTime < since) {
                    return;
                }
                const item = {
                    number: pullRequest.node.number,
                    title: pullRequest.node.title,
                    mergedAt: mergedAt,
                    head: pullRequest.node.headRefOid,
                    commits: [],
                    hasDuplicateCommits: false,
                };
                Vue.set(pullRequests, pullRequest.node.number, item);
            });
            //endregion

            const item = {
                name: nameWithOwner,
                private: repository.isPrivate,
                branches: branches,
                pullRequests: pullRequests
            };
            Vue.set(state.repositories, nameWithOwner, item);
        },
        setCommits(state, {commits, repository, branch, pullRequest}) {
            let refObject;
            if (typeof branch !== 'undefined') {
                refObject = state.repositories[repository].branches[branch];
            } else if (typeof pullRequest !== 'undefined') {
                refObject = state.repositories[repository].pullRequests[pullRequest];
            } else {
                return;
            }

            let commitsTmp = [];

            commits.forEach(commit => {
                if (!refObject.hasDuplicateCommits && loadedCommits.hasOwnProperty(commit.sha)) {
                    refObject.hasDuplicateCommits = true;
                }

                const item = {
                    message: commit.commit.message,
                    date: commit.commit.committer.date,
                    sha: commit.sha,
                    htmlUrl: commit.html_url,
                    duplication: loadedCommits.hasOwnProperty(commit.sha)
                };
                commitsTmp.push(item);
                loadedCommits[commit.sha] = true;
            });

            refObject.commits = commitsTmp;
        }
    },
    actions: {
        startLoadingProcess() {
            loadingProcessCount++;
        },
        endLoadingProcess({commit}) {
            loadingProcessCount--;
            if (loadingProcessCount > 0) {
                return;
            }

            commit('setLoadingProcess', false);
        },
        loadUserCommitSourceData({state, commit, dispatch, rootState}) {
            if (typeof rootState.settings.token !== 'string' || rootState.settings.token.length === 0) {
                return;
            }

            const query = '{ viewer { login avatarUrl name repositories(first: 20) { totalCount edges { node { nameWithOwner isPrivate refs(first: 20, refPrefix: "refs/heads/") { totalCount edges { node { name } } } pullRequests(states: MERGED, first: 30, orderBy:{field:UPDATED_AT, direction:DESC}) { edges { node { databaseId number title headRefOid mergedAt } } } } } } } }';

            const data = {'query': query};
            const options = {
                method: 'post',
                headers: {'Authorization': 'bearer ' + rootState.settings.token},
                data: data,
                url: 'https://api.github.com/graphql'
            };

            commit('setError');
            loadedCommits = {};
            commit('setLoadingProcess', true);
            dispatch('startLoadingProcess');

            return axios(options)
                .then(response => {
                    const viewer = response.data.data.viewer;
                    commit('setUser', viewer);

                    const sinceTime = getSinceDateFromDateType(rootState.settings.dateType, true).getTime();

                    viewer.repositories.edges.forEach(repository => {
                        commit('setRepository', {repository: repository.node, since: sinceTime});
                    });

                    Object.keys(state.repositories).forEach(fullName => {
                        dispatch('loadCommitsForRepository', fullName);
                    });
                })
                .catch((error) => commit('setError', error))
                .finally(() => dispatch('endLoadingProcess'));
        },
        loadCommitsForRepository({dispatch, state, rootState}, repository) {
            if (typeof rootState.settings.token !== 'string' || rootState.settings.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repository)) {
                return;
            }

            //Load commits from master at first
            //For exclusion master commits from other branches / pullRequests
            //(avoid duplication of commits)
            const masterBranch = 'master';

            let branches = Object.keys(state.repositories[repository].branches);
            let isIssetMaster = state.repositories[repository].branches.hasOwnProperty(masterBranch);
            if (isIssetMaster) {
                branches = branches.filter(branch => branch !== masterBranch);
            }

            let loadCommits = function () {
                branches.forEach(branch => {
                    dispatch('loadCommits', {repository: repository, branch: branch});
                });

                Object.keys(state.repositories[repository].pullRequests).forEach(pullRequest => {
                    dispatch('loadCommits', {repository: repository, pullRequest: pullRequest});
                });
            };

            if (isIssetMaster) {
                dispatch('loadCommits', {repository: repository, branch: masterBranch}).then(loadCommits);
            } else {
                loadCommits();
            }
        },
        loadCommits({state, commit, rootState, dispatch}, {repository, branch, pullRequest}) {
            if (typeof rootState.settings.token !== 'string' || rootState.settings.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repository)) {
                return;
            }

            if (typeof branch !== 'undefined' && !state.repositories[repository].branches.hasOwnProperty(branch)) {
                return;
            }

            if (typeof pullRequest !== 'undefined' && !state.repositories[repository].pullRequests.hasOwnProperty(pullRequest)) {
                return;
            }

            const url = 'https://api.github.com/repos/' + state.repositories[repository].name + '/commits';

            let sha = (typeof branch !== 'undefined')
                ? branch
                : state.repositories[repository].pullRequests[pullRequest].head;

            dispatch('startLoadingProcess');
            return axios.get(url, {
                params: {
                    access_token: rootState.settings.token,
                    sha: sha,
                    author: state.user,
                    since: getSinceDateFromDateType(rootState.settings.dateType),
                    until: getUntilDateFromDateType(rootState.settings.dateType),
                    per_page: 100
                }
            })
                .then(response => commit('setCommits', {
                    commits: response.data,
                    repository: repository,
                    branch: branch,
                    pullRequest: pullRequest
                }))
                .catch((error) => commit('setError', error))
                .finally(() => dispatch('endLoadingProcess'))
        },
    }
}
