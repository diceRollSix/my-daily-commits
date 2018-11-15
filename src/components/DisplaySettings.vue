<template>
    <v-widget title="Display Settings">
        <div slot="widget-content">
            <div class="basic pa-2">
                <v-checkbox
                        label="Show duplicated commits"
                        :disabled="loadingProcess" v-model="showDuplicatedCommits">
                    >
                </v-checkbox>
                <v-checkbox
                        label="Show merge commits"
                        :disabled="loadingProcess" v-model="showMergeCommits"
                ></v-checkbox>
                <v-checkbox
                        label="Show empty sources"
                        :disabled="loadingProcess" v-model="showEmptySources"
                ></v-checkbox>
                <v-checkbox
                        label="Show empty repositories"
                        :disabled="loadingProcess" v-model="showEmptyRepositories"
                ></v-checkbox>
            </div>
        </div>
    </v-widget>
</template>

<script>
    import {mapState} from 'vuex'
    import VWidget from "./util/VWidget";

    export default {
        name: 'display-settings',
        components: {VWidget},
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
