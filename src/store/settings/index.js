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
        saveToken({commit}, token) {
            if (token.length === 0) {
                return;
            }
            commit('saveToken', token);
        },
        saveDateType({commit}, dateType) {
            commit('saveDateType', dateType);
        },
        saveShowMergeCommits({commit}, showMergeCommits) {
            commit('saveShowMergeCommits', showMergeCommits);
        },
        saveShowEmptySources({commit}, showEmptySources) {
            commit('saveShowEmptySources', showEmptySources);
        },
        saveShowEmptyRepositories({commit}, showEmptyRepositories) {
            commit('saveShowEmptyRepositories', showEmptyRepositories);
        },
        saveShowDuplicatedCommits({commit}, showDuplicatedCommits) {
            commit('saveShowDuplicatedCommits', showDuplicatedCommits);
        },
    }
}
