<template>
    <div>
        <v-layout
                v-for="commit in commits"
                v-show="showCommit(commit)"
                :key="commit.sha"
                class="pl-4"
                row
                wrap
        >
            <v-flex d-flex xs12 sm2>
                <v-tooltip bottom>
                    <span class="pa-1" slot="activator">{{ commit.date | shortDate }}</span>
                    <span>{{ commit.date | formattedDate }}</span>
                </v-tooltip>
            </v-flex>
            <v-flex d-flex xs12 sm8>
                {{ getShortCommitMessage(commit.message)}}
            </v-flex>
            <v-flex d-flex xs12 sm2>
                <v-btn
                        flat
                        small
                        target="_blank"
                        href="commit.htmlUrl"
                >{{ getSmallSha(commit.sha) }}
                </v-btn>
            </v-flex>
        </v-layout>
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
            },
            getShortCommitMessage: (message) => {
                if (typeof message !== 'string') {
                    return '';
                }

                const eolIndex = message.indexOf("\n");

                return eolIndex === -1
                    ? message
                    : message.substr(0, eolIndex);
            },
        }
    }
</script>
