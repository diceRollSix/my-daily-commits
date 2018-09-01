import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: '',
        repositories: [],
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        },
        setRepositories(state, repositories) {
            let reposTmp = [];
            for (let key in repositories) {
                reposTmp.push({
                    id: repositories[key].id,
                    name: repositories[key].full_name,
                    private: repositories[key].private,
                });
            }
            state.repositories = reposTmp;
        }
    },
    actions: {
        saveToken({commit}, token) {
            if (token.length === 0) {
                return;
            }
            return commit('saveToken', token);
        },
        loadRepositories({state, commit}) {
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
                .then(response => commit('setRepositories', response.data))
                .catch((error) => console.log(error));
        },


    },
    plugins: [
        createPersistedState({
            paths: ['token']
        })
    ]
})
