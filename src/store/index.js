import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import settings from './settings'
import repositories from './repositories'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        repositories,
        settings
    },
    plugins: [
        createPersistedState({
            paths: [
                'settings.token',
                'settings.dateType',
                'settings.showDuplicatedCommits',
                'settings.showMergeCommits',
                'settings.showEmptySources',
                'settings.showEmptyRepositories'
            ]
        })
    ]
})
