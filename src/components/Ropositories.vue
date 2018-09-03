<template>
    <div>
        <div
                v-for="repo in repositories"
                :key="repo.id"
        >{{ repo.name }}
            <div
                    v-for="branch in repo.branches"
                    class="branch"
            >{{ branch.name }}
                <div
                        v-for="commit in branch.commits"
                        class="commit"
                >{{ commit.date }} {{ commit.message }}
                </div>
            </div>


            <div class="pull_request_title">PullRequests</div>
            <div
                    v-for="pullRequest in repo.pullRequests"
                    class="pull_request"
            >{{ pullRequest.title }}
                <div
                        v-for="commit in pullRequest.commits"
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
            }
        },
        methods: {
            ...mapActions(['loadUser'])
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
