<template>
    <div>
        <v-card
                v-for="commit in commits"
                v-show="showCommit(commit)"
                :key="commit.sha"
                class="pl-4"
        >
            <pre class="pl-1">{{ commit.message }}</pre>
            <v-card-actions>
                <v-tooltip bottom>
                    <span class="pa-1" slot="activator">{{ commit.date | shortDate }}</span>
                    <span>{{ commit.date | formattedDate }}</span>
                </v-tooltip>
                <v-btn
                        flat
                        small
                        target="_blank"
                        href="commit.htmlUrl"
                >{{ getSmallSha(commit.sha) }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'commits',
        props: {
            commits: Array
        },
        computed: {
            ...mapState({
                showMergeCommits: state => state.settings.showMergeCommits,
                showDuplicatedCommits: state => state.settings.showDuplicatedCommits,
            })
        },
        methods: {
            showCommit: function (commit) {
                let show = this.showMergeCommits || (commit.message.indexOf('Merge branch') !== 0);
                if (!show) {
                    return false;
                }
                return this.showDuplicatedCommits || !commit.duplication;
            },
            getSmallSha: function (sha) {
                return typeof sha === 'string' ? sha.slice(0, 8) : '';
            }
        }
    }
</script>
