<template>
    <div>
        <div>
            <input type="checkbox" id="show_duplicated_commits" v-model="showDuplicatedCommits">
            <label for="show_duplicated_commits">Show duplicated commits</label>
        </div>
        <div>
            <input type="checkbox" id="show_merge_commits" v-model="showMergeCommits">
            <label for="show_merge_commits">Show merge commits</label>
        </div>
        <div>
            <input type="checkbox" id="show_empty_sources" v-model="showEmptySources">
            <label for="show_empty_sources">Show empty sources</label>
        </div>
        <div>
            <input type="checkbox" id="show_empty_repositories" v-model="showEmptyRepositories">
            <label for="show_empty_repositories">Show empty repositories</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'display-settings',
        computed: {
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
