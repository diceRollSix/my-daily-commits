<template>
    <div>
        <div
                v-for="commit in commits"
                v-show="showCommit(commit)"
                class="commit"
        >
            <div>{{ commit.date | formattedDate }}</div>
            <div>{{ getShortCommitMessage(commit.message) }}</div>
            <a target="_blank" :href="commit.htmlUrl">{{ getSmallSha(commit.sha) }}</a>
        </div>
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

<style>
    .commit {
        margin-left: 40px;
    }

</style>
