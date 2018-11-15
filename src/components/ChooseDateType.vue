<template>

    <v-widget title="Date Period" >
        <div slot="widget-content">
            <div class="basic pa-2">
                <v-radio-group v-model="dateType">
                    <v-radio label="Previous Week"
                             color="info"
                             :value="DATE_TYPE.PREVIOUS_WEEK"
                             :disabled="loadingProcess"
                    ></v-radio>
                    <v-radio label="LastFriday"
                             color="info"
                             :value="DATE_TYPE.LAST_FRIDAY"
                             :disabled="loadingProcess"
                    ></v-radio>
                    <v-radio label="Current Week"
                             color="info"
                             :value="DATE_TYPE.CURRENT_WEEK"
                             :disabled="loadingProcess"
                    ></v-radio>
                    <v-radio label="Yesterday"
                             color="info"
                             :value="DATE_TYPE.YESTERDAY"
                             :disabled="loadingProcess"
                    ></v-radio>
                    <v-radio label="Today"
                             color="info"
                             :value="DATE_TYPE.TODAY"
                             :disabled="loadingProcess"
                    ></v-radio>
                </v-radio-group>
            </div>
        </div>
    </v-widget>
</template>

<script>
    import {DATE_TYPE} from '../helpers'
    import {mapState} from 'vuex'
    import VWidget from "./util/VWidget";

    export default {
        name: 'choose-date-type',
        components: {VWidget},
        data() {
            return {
                DATE_TYPE
            }
        },
        computed: {
            ...mapState({
                loadingProcess: state => state.repositories.loadingProcess
            }),
            dateType: {
                get() {
                    return this.$store.state.settings.dateType
                },
                set(value) {
                    this.$store.dispatch('saveDateType', value)
                }
            }
        },
    }
</script>

<style scoped>
</style>
