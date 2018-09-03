import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";
import {getSinceDateFromDateType, getUntilDateFromDateType} from './helpers';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: '',
        token: '',
        repositories: {},
        dateType: '3',

        showMergeCommits: false,
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        },
        saveDateType(state, dateType) {
            state.dateType = dateType;
        },
        saveShowMergeCommits(state, showMergeCommits) {
            state.showMergeCommits = showMergeCommits;
        },
        setUser(state, userData) {
            if (userData.hasOwnProperty('login')) {
                state.user = userData.login;
            }
        },
        setRepositories(state, repositories) {
            for (let key in repositories) {
                if (!repositories.hasOwnProperty(key)) {
                    continue;
                }

                const id = repositories[key].id;
                if (!state.repositories.hasOwnProperty(id)) {
                    const item = {
                        name: repositories[key].full_name,
                        private: repositories[key].private,
                        branches: {},
                        pullRequests: {}
                    };
                    Vue.set(state.repositories, id, item);
                }
            }
        },
        setBranchesForRepository(state, {branchData, repositoryId}) {
            for (let key in branchData) {
                if (!branchData.hasOwnProperty(key)) {
                    continue;
                }

                const name = branchData[key].name;
                const item = {
                    name: name,
                    commits: []
                };
                Vue.set(state.repositories[repositoryId].branches, name, item);
            }
        },
        setPullRequestsForRepository(state, {pullRequests, repositoryId}) {
            const since = getSinceDateFromDateType(state.dateType, true).getTime();
            const until = getUntilDateFromDateType(state.dateType, true).getTime();

            for (let key in pullRequests) {
                if (!pullRequests.hasOwnProperty(key)) {
                    continue;
                }

                const merged_at = pullRequests[key].merged_at;
                const merged_at_time = (new Date(merged_at)).getTime();

                if (merged_at_time > until) {
                    continue;
                }

                if (merged_at_time < since) {
                    break;
                }

                const id = pullRequests[key].id;
                const item = {
                    title: pullRequests[key].title,
                    merged_at: merged_at,
                    head: pullRequests[key].head.sha,
                    commits: []
                };
                Vue.set(state.repositories[repositoryId].pullRequests, id, item);
            }
        },
        setCommits(state, {commits, repositoryId, branch, pullRequestId}) {
            let commitsTmp = [];

            const masterCommits = state.repositories[repositoryId].branches.hasOwnProperty('master')
                ? state.repositories[repositoryId].branches.master.commits
                : [];

            let masterCommitsObject = {};
            for (let key in masterCommits) {
                masterCommitsObject[masterCommits[key].sha] = true;
            }

            for (let key in commits) {
                const commit = commits[key];
                const sha = commit.sha;

                if (masterCommitsObject.hasOwnProperty(sha)) {
                    //Уже есть в мастере - пропускаем.
                    continue;
                }

                const item = {
                    message: commit.commit.message,
                    date: commit.commit.committer.date,
                    sha: sha
                };
                commitsTmp.push(item);
            }

            if (typeof branch !== 'undefined') {
                state.repositories[repositoryId].branches[branch].commits = commitsTmp;
            } else if (typeof pullRequestId !== 'undefined') {
                state.repositories[repositoryId].pullRequests[pullRequestId].commits = commitsTmp;
            }
        }
    },
    actions: {
        saveToken({commit}, token) {
            if (token.length === 0) {
                return;
            }
            return commit('saveToken', token);
        },
        saveDateType({commit}, dateType) {
            return commit('saveDateType', dateType);
        },
        saveShowMergeCommits({commit}, showMergeCommits) {
            return commit('saveShowMergeCommits', showMergeCommits);
        },
        //TODO каждое действие сделать атомарной загрузкой
        //создать действие из цепочки действий
        loadUser({state, commit, dispatch}) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            const url = 'https://api.github.com/user';

            return axios.get(url, {params: {access_token: state.token}})
                .then(response => {
                    commit('setUser', response.data);
                    dispatch('loadRepositories');
                })
                .catch((error) => console.log(error));
        },
        loadRepositories({dispatch, state, commit}) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }

            const url = 'https://api.github.com/user/repos';

            return axios.get(url, {
                params: {
                    access_token: state.token,
                }
            })
                .then(response => {
                    commit('setRepositories', response.data);
                    dispatch('loadBranchesForAllRepositories');
                })
                .catch((error) => console.log(error));
        },
        loadBranchesForAllRepositories({dispatch, state}) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }

            for (let key in state.repositories) {
                if (!state.repositories.hasOwnProperty(key)) {
                    continue;
                }

                dispatch('loadBranches', key).then(function () {
                    dispatch('loadPullRequests', key);
                })
            }
        },
        loadBranches({dispatch, state, commit}, repositoryId) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }

            const url = 'https://api.github.com/repos/' + state.repositories[repositoryId].name + '/branches';

            return axios.get(url, {params: {access_token: state.token}})
                .then(response => {
                    commit('setBranchesForRepository', {
                        branchData: response.data,
                        repositoryId: repositoryId
                    });
                    dispatch('loadCommitsForBranches', repositoryId);
                })
                .catch((error) => console.log(error));
        },
        loadCommitsForBranches({dispatch, state}, repositoryId) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }

            const masterBranch = 'master';

            let branches = [];
            let isIssetMaster = false;

            for (let key in state.repositories[repositoryId].branches) {
                if (!state.repositories[repositoryId].branches.hasOwnProperty(key)) {
                    continue;
                }

                if (key === masterBranch) {
                    isIssetMaster = true;
                    continue;
                }

                branches.push(key);
            }

            if (isIssetMaster) {
                dispatch('loadCommits', {repositoryId: repositoryId, branch: masterBranch}).then(() => {
                    for (let key in branches) {
                        dispatch('loadCommits', {repositoryId: repositoryId, branch: branches[key]});
                    }
                });
            } else {
                for (let key in branches) {
                    dispatch('loadCommits', {repositoryId: repositoryId, branch: branches[key]});
                }
            }
        },
        loadCommits({state, commit}, {repositoryId, branch}) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }
            if (!state.repositories[repositoryId].branches.hasOwnProperty(branch)) {
                return;
            }

            const url = 'https://api.github.com/repos/' + state.repositories[repositoryId].name + '/commits';

            return axios.get(url, {
                params: {
                    access_token: state.token,
                    sha: branch,
                    author: state.user,
                    since: getSinceDateFromDateType(state.dateType),
                    until: getUntilDateFromDateType(state.dateType),
                    per_page: 100
                }
            })
                .then(response => commit('setCommits', {
                    commits: response.data,
                    repositoryId: repositoryId,
                    branch: branch
                }))
                .catch((error) => console.log(error));
        },

        loadPullRequests({dispatch, state, commit}, repositoryId) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }

            const url = 'https://api.github.com/repos/' + state.repositories[repositoryId].name + '/pulls';

            //Take first 100 pull requests
            //TODO add load next page (page:2..) if no requests in date range
            return axios.get(url, {
                params: {
                    access_token: state.token,
                    direction: 'desc',
                    state: 'closed',
                    per_page: 100
                }
            })
                .then(response => {
                    commit('setPullRequestsForRepository', {
                        pullRequests: response.data,
                        repositoryId: repositoryId
                    });
                    dispatch('loadCommitsForRepositoryPullRequests', repositoryId);
                })
                .catch((error) => console.log(error));
        },
        loadCommitsForRepositoryPullRequests({dispatch, state}, repositoryId) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }

            for (let key in state.repositories[repositoryId].pullRequests) {
                if (!state.repositories[repositoryId].pullRequests.hasOwnProperty(key)) {
                    continue;
                }

                dispatch('loadCommitsForPullRequest', {repositoryId: repositoryId, pullRequestId: key});
            }
        },

        loadCommitsForPullRequest({state, commit}, {repositoryId, pullRequestId}) {
            if (typeof  state.token !== 'string') {
                return;
            }
            if (state.token.length === 0) {
                return;
            }
            if (!state.repositories.hasOwnProperty(repositoryId)) {
                return;
            }
            if (!state.repositories[repositoryId].pullRequests.hasOwnProperty(pullRequestId)) {
                return;
            }

            const pullRequest = state.repositories[repositoryId].pullRequests[pullRequestId];

            const url = 'https://api.github.com/repos/' + state.repositories[repositoryId].name + '/commits';

            return axios.get(url, {
                params: {
                    access_token: state.token,
                    sha: pullRequest.head,
                    author: state.user,
                    since: getSinceDateFromDateType(state.dateType),
                    until: getUntilDateFromDateType(state.dateType),
                    per_page: 100
                }
            })
                .then(response => commit('setCommits', {
                    commits: response.data,
                    repositoryId: repositoryId,
                    pullRequestId: pullRequestId
                }))
                .catch((error) => console.log(error));
        },
    },
    plugins: [
        createPersistedState({
            paths: ['token', 'dateType', 'showMergeCommits']
        })
    ]
})
