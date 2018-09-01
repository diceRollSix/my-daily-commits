<template>
    <div>
        <div
                v-for="repo in repositories"
                :key="repo.id"
        >{{ repo.name }}
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
</style>
