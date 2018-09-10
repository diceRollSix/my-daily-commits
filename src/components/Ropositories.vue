<template>
    <div>
        <div
                v-for="repo in repositories"
                v-show="showRepository(repo)"
                :key="repo.id"
        >{{ repo.name }}
            <div
                    v-for="branch in repo.branches"
                    v-show="showSource(branch)"
                    class="branch"
            >{{ branch.name }} <span v-if="branch.hasDuplicateCommits">(With Duplication)</span>
                <commits :commits="branch.commits"/>
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
            >{{ pullRequest.title }} <span v-if="pullRequest.hasDuplicateCommits">(With Duplication)</span>
                <commits :commits="pullRequest.commits"/>
            </div>
        </div>
        <button @click="loadUserCommitSourceData">Load repos with token</button>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import Commits from "./Commits";

    export default {
        name: 'repositories',
        components: {Commits},
        computed: {
            ...mapState({
                repositories: state => state.repositories.repositories,
                showMergeCommits: state => state.settings.showMergeCommits,
                showEmptySources: state => state.settings.showEmptySources,
                showEmptyRepositories: state => state.settings.showEmptyRepositories,
            })
        },
        methods: {
            ...mapActions(['loadUserCommitSourceData']),
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

                for (let key in pullRequests) {
                    if (!pullRequests.hasOwnProperty(key)) {
                        continue;
                    }

                    if (pullRequests[key].commits.length !== 0) {
                        return true;
                    }
                }

                return false;
            },
            showRepository: function (repository) {
                if (this.showEmptyRepositories) {
                    return true;
                }

                for (let key in repository.branches) {
                    if (!repository.branches.hasOwnProperty(key)) {
                        continue;
                    }

                    if (repository.branches[key].commits.length !== 0) {
                        return true;
                    }
                }

                return this.showPullRequestsTitle(repository.pullRequests);
            },
        }
    }
</script>

<style>
    .branch {
        margin-left: 20px;
    }

    .pull_request {
        margin-left: 25px;
    }

    .pull_request_title {
        margin-left: 25px;
        color: red;
    }

</style>
