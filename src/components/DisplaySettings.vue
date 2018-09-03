<template>
    <div>
        <input type="checkbox" id="show_merge_commits" v-model="showMergeCommits">
        <label for="show_merge_commits">Show Merge commits</label>
    </div>
</template>

<script>
    export default {
        name: 'display-settings',
        computed: {
            showMergeCommits: {
                get() {
                    return this.$store.state.showMergeCommits
                },
                set(value) {
                    this.$store.dispatch('saveShowMergeCommits', value)
                }
            }
        },
    }
</script>

<style scoped>
</style>
