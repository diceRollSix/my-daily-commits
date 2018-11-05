<template>
    <v-dialog
            :value="loading"
            hide-overlay
            persistent
            width="300"
    >
        <v-card
                color="black"
                dark
        >
            <v-card-text>
                Loading github data
                <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                ></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
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
