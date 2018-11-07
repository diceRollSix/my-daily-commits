<template>
    <v-btn
            v-if="login"
            icon
            large
            flat
    >
        <v-avatar size="30px">
            <img :src="avatarUrl" :alt="name"/>
        </v-avatar>
    </v-btn>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'user-avatar',
        computed: {
            ...mapState({
                avatarUrl: state => state.repositories.avatarUrl,
                login: state => state.repositories.login,
                name: state => state.repositories.name,
            })
        },
    }
</script>

<style>

</style>
