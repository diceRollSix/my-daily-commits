<template>
    <div>{{date}}</div>
</template>

<script>
    import {getDateFromDateType} from './../helpers';

    export default {
        name: 'since-date',
        computed: {
            date: function () {
                return getDateFromDateType(this.$store.state.dateType);
            }
        },
    }
</script>

<style scoped>
</style>
