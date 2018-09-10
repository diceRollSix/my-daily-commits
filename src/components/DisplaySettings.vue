<template>
    <div>
        <div>
            <input type="checkbox" id="show_duplicated_commits" :disabled="loadingProcess" v-model="showDuplicatedCommits">
            <label for="show_duplicated_commits">Show duplicated commits</label>
        </div>
        <div>
            <input type="checkbox" id="show_merge_commits" :disabled="loadingProcess" v-model="showMergeCommits">
            <label for="show_merge_commits">Show merge commits</label>
        </div>
        <div>
            <input type="checkbox" id="show_empty_sources" :disabled="loadingProcess" v-model="showEmptySources">
            <label for="show_empty_sources">Show empty sources</label>
        </div>
        <div>
            <input type="checkbox" id="show_empty_repositories" :disabled="loadingProcess" v-model="showEmptyRepositories">
            <label for="show_empty_repositories">Show empty repositories</label>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'display-settings',
        computed: {
            ...mapState({
                loadingProcess: state => state.repositories.loadingProcess
            }),
            showDuplicatedCommits: {
                get() {
                    return this.$store.state.settings.showDuplicatedCommits
                },
                set(value) {
                    this.$store.dispatch('saveShowDuplicatedCommits', value)
                }
            },
            showMergeCommits: {
                get() {
                    return this.$store.state.settings.showMergeCommits
                },
                set(value) {
                    this.$store.dispatch('saveShowMergeCommits', value)
                }
            },
            showEmptySources: {
                get() {
                    return this.$store.state.settings.showEmptySources
                },
                set(value) {
                    this.$store.dispatch('saveShowEmptySources', value)
                }
            },
            showEmptyRepositories: {
                get() {
                    return this.$store.state.settings.showEmptyRepositories
                },
                set(value) {
                    this.$store.dispatch('saveShowEmptyRepositories', value)
                }
            }
        },
    }
</script>

<style scoped>
</style>
