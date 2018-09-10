<template>
    <div>
        <button
                @click="loadUserCommitSourceData"
                :disabled="loadingProcess"
        >Load repos with token
        </button>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'

    export default {
        name: 'load-button',
        computed: {
            ...mapState({
                loadingProcess: state => state.repositories.loadingProcess
            })
        },
        methods: {
            ...mapActions(['loadUserCommitSourceData'])
        }
    }
</script>

<style>
</style>
