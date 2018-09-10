<template>
    <div v-if="user">
        <img :src="avatarUrl" class="avatar" alt="Avatar">
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
    .avatar{
        width: 50px;
        height: 50px;
    }
</style>
