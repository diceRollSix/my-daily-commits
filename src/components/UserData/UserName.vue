<template>
    <v-btn v-if="login" :href="url" target="_blank">
        {{ login }}
    </v-btn>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'user-name',
        computed: {
            ...mapState({
                avatarUrl: state => state.repositories.avatarUrl,
                login: state => state.repositories.login,
                url: state => state.repositories.url
            })
        },
    }
</script>

<style>
</style>
