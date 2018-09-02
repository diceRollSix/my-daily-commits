import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: '',
        token: '',
        repositories: {},
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        },
        setUser(state, userData) {
            state.user = userData.login;
        },
        setRepositories(state, repositories) {
            for (let key in repositories) {
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
            for (let key in commits) {
                const commit = commits[key];
                const item = {
                    message: commit.commit.message,
                    date: commit.commit.committer.date
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

            for (let key in state.repositories[repositoryId].branches) {
                if (!state.repositories[repositoryId].branches.hasOwnProperty(key)) {
                    continue;
                }

                dispatch('loadCommits', {repositoryId: repositoryId, branch: key});
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
                    since: '2018-08-27T00:00:00.000Z'
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
            paths: ['token']
        })
    ]
})
