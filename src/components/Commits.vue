<template>
    <div>
        <div
                v-for="commit in commits"
                v-show="showCommit(commit.message)"
                class="commit"
        >{{ commit.date }} {{ commit.message }}
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
            })
        },
        methods: {
            showCommit: function (message) {
                return this.showMergeCommits || (message.indexOf('Merge branch') !== 0);
            },
        }
    }
</script>

<style>
    .commit {
        margin-left: 40px;
    }

</style>
