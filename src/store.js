import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: '',
    },
    mutations: {
        saveToken(state, token) {
            state.token = token;
        }
    },
    actions: {
        saveToken({commit}, token) {
            if (token.length === 0) {
                return;
            }
            return commit('saveToken', token);
        }

    },
    plugins: [
        createPersistedState({
            paths: ['token']
        })
    ]
})
