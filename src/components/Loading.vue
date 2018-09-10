<template>
    <div v-if="loading">Loading...</div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'loading',
        computed: {
            ...mapState({
                loading: state => state.repositories.loadingProcess
            })
        },
    }
</script>

<style scoped>
</style>
