<template>
    <div>
        <div
                v-for="repo in repositories"
                v-show="showRepository(repo)"
                :key="repo.id"
        >
            <v-list>
                <v-subheader>{{ repo.name }}</v-subheader>
                <v-list-group
                        v-for="branch in repo.branches"
                        v-show="showSource(branch)"
                        :key="branch.name"
                        no-action
                        lazy
                >
                    <div slot="activator" class="list-group-tile">
                        <v-badge
                                color="orange"
                                right
                        >
                            <v-icon
                                    slot="badge"
                                    dark
                                    small
                                    v-if="branch.hasDuplicateCommits"
                            >file_copy
                            </v-icon>
                            <div>
                                {{ branch.name }}
                            </div>
                        </v-badge>

                    </div>
                    <commits :commits="branch.commits"/>
                </v-list-group>
            </v-list>

            <v-list>
                <v-subheader
                        v-show="showPullRequestsTitle(repo.pullRequests)"
                >{{ repo.name + ' (PullRequests)' }}
                </v-subheader>
                <v-list-group
                        v-for="pullRequest in repo.pullRequests"
                        v-show="showSource(pullRequest)"
                        :key="pullRequest.title"
                        no-action
                >
                    <div slot="activator" class="list-group-tile">
                        <v-badge
                                color="orange"
                                right
                        >
                            <v-icon
                                    slot="badge"
                                    dark
                                    small
                                    v-if="pullRequest.hasDuplicateCommits"
                            >file_copy
                            </v-icon>
                            <div>
                                {{ pullRequest.title }}
                            </div>
                        </v-badge>

                    </div>
                    <commits :commits="pullRequest.commits"/>
                </v-list-group>
            </v-list>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import Commits from "./Commits";
    import VWidget from "./util/VWidget";

    export default {
        name: 'repositories',
        components: {VWidget, Commits},
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
    .list-group-tile {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
        padding: 10px 30px 10px 15px;
    }
</style>
