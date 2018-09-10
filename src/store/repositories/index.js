import Vue from "vue";
import {getSinceDateFromDateType, getUntilDateFromDateType} from "../../helpers";
import axios from "axios";

export default {
    state: {
        user: '',
        repositories: {},
    },
    mutations: {
        setUser(state, login) {
            state.user = login;
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

            const masterCommits = state.repositories[repository].branches.hasOwnProperty('master')
                ? state.repositories[repository].branches.master.commits
                : [];

            let masterCommitsObject = {};
            masterCommits.forEach(commit => {
                masterCommitsObject[commit.sha] = true;
            });

            commits.forEach(commit => {
                if (!refObject.hasDuplicateCommits && masterCommitsObject.hasOwnProperty(commit.sha)) {
                    refObject.hasDuplicateCommits = true;
                }

                const item = {
                    message: commit.commit.message,
                    date: commit.commit.committer.date,
                    sha: commit.sha,
                    htmlUrl: commit.html_url,
                    duplication: masterCommitsObject.hasOwnProperty(commit.sha)
                };
                commitsTmp.push(item);
            });

            refObject.commits = commitsTmp;
        }
    },
    actions: {
        //TODO каждое действие сделать атомарной загрузкой
        //создать действие из цепочки действий
        loadUserCommitSourceData({state, commit, dispatch, rootState}) {
            if (typeof rootState.settings.token !== 'string' || rootState.settings.token.length === 0) {
                return;
            }

            const query = '{ viewer { login name repositories(first: 20) { totalCount edges { node { nameWithOwner isPrivate refs(first: 20, refPrefix: "refs/heads/") { totalCount edges { node { name } } } pullRequests(states: MERGED, first: 30, orderBy:{field:UPDATED_AT, direction:DESC}) { edges { node { databaseId number title headRefOid mergedAt } } } } } } } }';

            const data = {'query': query};
            const options = {
                method: 'post',
                headers: {'Authorization': 'bearer ' + rootState.settings.token},
                data: data,
                url: 'https://api.github.com/graphql'
            };

            axios(options)
                .then(response => {
                    //TODO check error
                    const viewer = response.data.data.viewer;
                    commit('setUser', viewer.login);

                    const sinceTime = getSinceDateFromDateType(rootState.settings.dateType, true).getTime();

                    viewer.repositories.edges.forEach(repository => {
                        commit('setRepository', {repository: repository.node, since: sinceTime});
                    });

                    Object.keys(state.repositories).forEach(fullName => {
                        dispatch('loadCommitsForRepository', fullName);
                    });
                })
                .catch((error) => console.log(error));
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
        loadCommits({state, commit, rootState}, {repository, branch, pullRequest}) {
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
                .catch((error) => console.log(error));
        },
    }
}
