<template>
    <v-card>
        <v-card-title primary-title>
            {{dateSince | formattedDate}} - {{dateUntil | formattedDate}}
        </v-card-title>
    </v-card>
</template>

<script>
    import {getSinceDateFromDateType, getUntilDateFromDateType} from './../helpers';

    export default {
        name: 'since-until-date',
        computed: {
            dateSince: function () {
                return getSinceDateFromDateType(this.$store.state.settings.dateType);
            },
            dateUntil: function () {
                return getUntilDateFromDateType(this.$store.state.settings.dateType);
            }
        },
    }
</script>

<style scoped>
</style>
