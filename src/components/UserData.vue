<template>
    <div v-if="user">
        <img :src="avatarUrl" alt="Avatar">
        <div>{{ user }}</div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'user-avatar',
        computed: {
            ...mapState({
                avatarUrl: state => state.repositories.avatarUrl,
                user: state => state.repositories.user
            })
        },
    }
</script>

<style scoped>
</style>
