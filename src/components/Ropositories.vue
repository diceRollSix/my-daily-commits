<template>
    <div>
        <div
                v-for="repo in repositories"
                v-show="showRepository(repo)"
                :key="repo.id"
        >
            <v-widget :title="repo.name">
                <div slot="widget-content">
                    <v-list>
                        <v-list-group
                                v-for="branch in repo.branches"
                                v-show="showSource(branch)"
                                :key="branch.name"
                                no-action
                                sub-group
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ branch.name }}
                                        <span v-if="branch.hasDuplicateCommits">(With Duplication)</span>
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <commits :commits="branch.commits"/>
                        </v-list-group>
                    </v-list>
                </div>
            </v-widget>

            <v-widget
                    :title="repo.name + ' (PullRequests)'"
                    v-show="showPullRequestsTitle(repo.pullRequests)"
            >
                <div slot="widget-content">
                    <v-list>
                        <v-list-group
                                v-for="pullRequest in repo.pullRequests"
                                v-show="showSource(pullRequest)"
                                :key="pullRequest.title"
                                sub-group
                                no-action
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ pullRequest.title }}
                                        <span v-if="pullRequest.hasDuplicateCommits">(With Duplication)</span>
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <commits :commits="pullRequest.commits"/>
                        </v-list-group>
                    </v-list>
                </div>
            </v-widget>
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
