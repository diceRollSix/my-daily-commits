<template>
    <div>
        <div
                v-for="repo in repositories"
                :key="repo.id"
        >{{ repo.name }}
            <div
                    v-for="branch in repo.branches"
                    v-show="showSource(branch)"
                    class="branch"
            >{{ branch.name }}
                <div
                        v-for="commit in branch.commits"
                        v-show="showCommit(commit.message)"

                        class="commit"
                >{{ commit.date }} {{ commit.message }}
                </div>
            </div>


            <div
                    v-show="showPullRequestsTitle(repo.pullRequests)"
                    class="pull_request_title"
            >PullRequests
            </div>
            <div
                    v-for="pullRequest in repo.pullRequests"
                    v-show="showSource(pullRequest)"
                    class="pull_request"
            >{{ pullRequest.title }}
                <div
                        v-for="commit in pullRequest.commits"
                        v-show="showCommit(commit.message)"
                        class="commit"
                >{{ commit.date }} {{ commit.message }}
                </div>
            </div>
        </div>
        <button @click="loadUser">Load repos with token</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: 'repositories',
        computed: {
            repositories: function () {
                return this.$store.state.repositories;
            },
            showMergeCommits: function () {
                return this.$store.state.showMergeCommits;
            },
            showEmptySources: function () {
                return this.$store.state.showEmptySources;
            },
        },
        methods: {
            ...mapActions(['loadUser']),
            showCommit: function (message) {
                return this.showMergeCommits || (message.indexOf('Merge branch') !== 0);
            },
            showSource: function (source) {
                if (!source.hasOwnProperty('commits')) {
                    return true;
                }

                return this.showEmptySources || (source.commits.length !== 0);
            },
            showPullRequestsTitle: function (pullRequests) {
                if (this.showEmptySources) {
                    return true;
                }

                let show = false;

                for (let key in pullRequests) {
                    if (!pullRequests.hasOwnProperty(key)) {
                        continue;
                    }

                    if (pullRequests[key].commits.length !== 0) {
                        show = true;
                        break;
                    }
                }

                return show;
            },
        }
    }
</script>

<style scoped>
    .branch {
        margin-left: 20px;
    }

    .commit {
        margin-left: 40px;
    }

    .pull_request {
        margin-left: 25px;
    }

    .pull_request_title {
        margin-left: 25px;
        color: red;
    }

</style>
