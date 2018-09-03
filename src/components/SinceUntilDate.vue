<template>
    <div>{{dateSince}} - {{dateUntil}}</div>
</template>

<script>
    import {getSinceDateFromDateType, getUntilDateFromDateType} from './../helpers';

    export default {
        name: 'since-until-date',
        computed: {
            dateSince: function () {
                return getSinceDateFromDateType(this.$store.state.dateType);
            },
            dateUntil: function () {
                return getUntilDateFromDateType(this.$store.state.dateType);
            }
        },
    }
</script>

<style scoped>
</style>
