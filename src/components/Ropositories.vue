<template>
    <div class="repositories">
        <loading/>
        <errors/>
        <user-avatar/>
        <selected-since-until-date/>
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
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Commits from "./Commits";
    import Loading from "./Loading";
    import Errors from "./Errors";
    import UserAvatar from "./UserData";
    import SelectedSinceUntilDate from "./SelectedSinceUntilDate";

    export default {
        name: 'repositories',
        components: {SelectedSinceUntilDate, UserAvatar, Errors, Loading, Commits},
        computed: {
            ...mapState({
                repositories: state => state.repositories.repositories,
                showMergeCommits: state => state.settings.showMergeCommits,
                showEmptySources: state => state.settings.showEmptySources,
                showDuplicatedCommits: state => state.settings.showDuplicatedCommits,
                showEmptyRepositories: state => state.settings.showEmptyRepositories,
            })
        },
        methods: {
            showSource: function (source) {
                if (!source.hasOwnProperty('commits')) {
                    return true;
                }

                let showEmptySources = this.showEmptySources || (source.commits.length !== 0);
                if (source.commits.length === 0) {
                    return showEmptySources;
                }

                let duplicationCommitsCount = 0;
                source.commits.forEach(commit => {
                    if (commit.duplication) {
                        duplicationCommitsCount++;
                    }
                });
                let onlyDuplicationCommits = duplicationCommitsCount === source.commits.length;

                return showEmptySources && (this.showDuplicatedCommits || !onlyDuplicationCommits);
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
    .repositories {
        height: 700px;
        overflow-y: scroll;
    }

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
