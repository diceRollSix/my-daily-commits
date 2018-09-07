<template>
    <div>
        <h3>{{ token }}</h3>
        <div><input
                v-model="tokenNew"
                type="text"
        ></div>
        <button @click="saveToken(tokenNew)">Save GitHub token</button>
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
                token: state => state.settings.token
            })
        },
        methods: {
            ...mapActions(['saveToken'])
        }
    }
</script>

<style scoped>
</style>
