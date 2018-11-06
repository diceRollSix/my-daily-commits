<template>
    <v-fab-transition>
        <v-btn
                @click="loadUserCommitSourceData"
                :disabled="loadingProcess"
                color="orange"
                dark
                fab
                fixed
                bottom
                right
        >
            <v-icon>cloud_download</v-icon>
        </v-btn>
    </v-fab-transition>
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
