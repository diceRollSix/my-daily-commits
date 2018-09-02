import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";
import {getDateFromDateType} from './helpers';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: '',
        token: '',
        repositories: {},
        dateType: '3'
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        },
        saveDateType(state, dateType) {
            state.dateType = dateType;
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
                        branches: {}
                    };
                    Vue.set(state.repositories, id, item);
                }
            }
        },
        setBranchesForRepository(state, data) {
            for (let key in data.branchData) {
                const name = data.branchData[key].name;
                const item = {
                    name: name,
                    commits: []
                };
                Vue.set(state.repositories[data.repositoryId].branches, name, item);
            }
        },
        setCommitsForBranch(state, {commits, repositoryId, branch}) {
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
            state.repositories[repositoryId].branches[branch].commits = commitsTmp;
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

                dispatch('loadBranches', key);
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
                    since: getDateFromDateType(state.dateType)
                }
            })
                .then(response => commit('setCommitsForBranch', {
                    commits: response.data,
                    repositoryId: repositoryId,
                    branch: branch
                }))
                .catch((error) => console.log(error));
        },
    },
    plugins: [
        createPersistedState({
            paths: ['token', 'dateType']
        })
    ]
})
