export default {
    state: {
        token: '',
        dateType: '3',

        showMergeCommits: false,
        showEmptySources: false,
        showEmptyRepositories: false,
    },
    mutation: {
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
        saveShowEmptySources({commit}, showEmptySources) {
            return commit('saveShowEmptySources', showEmptySources);
        },
        saveShowEmptyRepositories({commit}, showEmptyRepositories) {
            return commit('saveShowEmptyRepositories', showEmptyRepositories);
        },

    }
}
