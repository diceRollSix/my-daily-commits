<template>
    <div>
        <h3>{{ token }}</h3>
        <div><input
                v-model="tokenNew"
                type="text"
                :disabled="loadingProcess"
        ></div>
        <button
                @click="saveToken(tokenNew)"
                :disabled="loadingProcess"
        >Save GitHub token
        </button>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'

    export default {
        name: 'token',
        data() {
            return {
                tokenNew: ''
            }
        },
        computed: {
            ...mapState({
                token: state => state.settings.token,
                loadingProcess: state => state.repositories.loadingProcess
            })
        },
        methods: {
            ...mapActions(['saveToken'])
        }
    }
</script>

<style scoped>
</style>
