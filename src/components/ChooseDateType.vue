<template>
    <div>
        <input type="radio" id="prev_week" value="1" v-model="dateType">
        <label for="prev_week">Previous Week</label>
        <br>
        <input type="radio" id="week" value="2" v-model="dateType">
        <label for="week">Current Week</label>
        <br>
        <input type="radio" id="yesterday" value="3" v-model="dateType">
        <label for="yesterday">Yesterday</label>
        <br>
        <input type="radio" id="today" value="4" v-model="dateType">
        <label for="today">Today</label>
        <br>
    </div>
</template>

<script>
    export default {
        name: 'choose-date-type',
        computed: {
            dateType: {
                get() {
                    return this.$store.state.dateType
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
