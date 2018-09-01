import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: '',
        repositories: {},
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        },
        setRepositories(state, repositories) {
            for (let key in repositories) {
                const id = repositories[key].id;
                if (!state.repositories.hasOwnProperty(id)) {
                    const item = {
                        name: repositories[key].full_name,
                        private: repositories[key].private,
                        branches: []
                    };
                    Vue.set(state.repositories, id, item);
                }
            }
        },
        setBranchesForRepository(state, data) {
            let branchesTmp = [];
            for (let key in data.branchData) {
                branchesTmp.push(data.branchData[key].name);
            }

            state.repositories[data.repositoryId].branches = branchesTmp;
        }
    },
    actions: {
        saveToken({commit}, token) {
            if (token.length === 0) {
                return;
            }
            return commit('saveToken', token);
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
                    type: 'all'
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
        loadBranches({state, commit}, repositoryId) {
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
                .then(response => commit('setBranchesForRepository', {
                    branchData: response.data,
                    repositoryId: repositoryId
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
