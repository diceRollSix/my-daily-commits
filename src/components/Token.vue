<template>
    <v-widget :enableHeader="false">
        <div slot="widget-content">
            <div class="basic">
                <v-subheader class="pa-0">{{ token }}</v-subheader>
                <v-text-field
                        label="GitHub token"
                        v-model="tokenNew"
                        :disabled="loadingProcess"
                ></v-text-field>
                <v-btn
                        @click="saveToken(tokenNew)"
                        :disabled="loadingProcess"
                        small
                >Save GitHub token
                </v-btn>
            </div>
        </div>
    </v-widget>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import VWidget from "./util/VWidget";

    export default {
        name: 'token',
        components: {VWidget},
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
