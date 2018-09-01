<template>
    <div>
        <div
                v-for="repo in repositories"
                :key="repo.id"
        >{{ repo.name }}
            <div
                    v-for="branch in repo.branches"
                    class="branch"
            >{{ branch }}
            </div>
        </div>
        <button @click="loadRepositories">Load repos with token</button>
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
            ...mapActions(['loadRepositories'])
        }
    }
</script>

<style scoped>
    .branch {
        margin-left: 20px;
    }
</style>
