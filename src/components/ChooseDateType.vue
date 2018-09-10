<template>
    <div>
        <input type="radio" id="prev_week" :value="DATE_TYPE.PREVIOUS_WEEK" :disabled="loadingProcess" v-model="dateType">
        <label for="prev_week">Previous Week</label>
        <br>
        <input type="radio" id="week" :value="DATE_TYPE.CURRENT_WEEK" :disabled="loadingProcess" v-model="dateType">
        <label for="week">Current Week</label>
        <br>
        <input type="radio" id="yesterday" :value="DATE_TYPE.YESTERDAY" :disabled="loadingProcess" v-model="dateType">
        <label for="yesterday">Yesterday</label>
        <br>
        <input type="radio" id="today" :value="DATE_TYPE.TODAY" :disabled="loadingProcess" v-model="dateType">
        <label for="today">Today</label>
        <br>
    </div>
</template>

<script>
    import {DATE_TYPE} from '../helpers'
    import {mapState} from 'vuex'

    export default {
        name: 'choose-date-type',
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
