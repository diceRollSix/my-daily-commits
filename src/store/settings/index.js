import {DATE_TYPE} from '../../helpers'

export default {
    state: {
        token: '',
        dateType: DATE_TYPE.YESTERDAY,

        showMergeCommits: false,
        showEmptySources: false,
        showEmptyRepositories: false,
        showDuplicatedCommits: false,
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
        saveShowEmptySources(state, showEmptySources) {
            state.showEmptySources = showEmptySources;
        },
        saveShowEmptyRepositories(state, showEmptyRepositories) {
            state.showEmptyRepositories = showEmptyRepositories;
        },
        saveShowDuplicatedCommits(state, showDuplicatedCommits) {
            state.showDuplicatedCommits = showDuplicatedCommits;
        },
    },
    actions: {
        saveToken({commit, rootState}, token) {
            if (rootState.repositories.loadingProcess) {
                return;
            }

            if (token.length === 0) {
                return;
            }
            commit('saveToken', token);
        },
        saveDateType({commit, rootState}, dateType) {
            if (rootState.repositories.loadingProcess) {
                return;
            }
            commit('saveDateType', dateType);
        },
        saveShowMergeCommits({commit, rootState}, showMergeCommits) {
            if (rootState.repositories.loadingProcess) {
                return;
            }
            commit('saveShowMergeCommits', showMergeCommits);
        },
        saveShowEmptySources({commit, rootState}, showEmptySources) {
            if (rootState.repositories.loadingProcess) {
                return;
            }
            commit('saveShowEmptySources', showEmptySources);
        },
        saveShowEmptyRepositories({commit, rootState}, showEmptyRepositories) {
            if (rootState.repositories.loadingProcess) {
                return;
            }
            commit('saveShowEmptyRepositories', showEmptyRepositories);
        },
        saveShowDuplicatedCommits({commit, rootState}, showDuplicatedCommits) {
            if (rootState.repositories.loadingProcess) {
                return;
            }
            commit('saveShowDuplicatedCommits', showDuplicatedCommits);
        },
    }
}
