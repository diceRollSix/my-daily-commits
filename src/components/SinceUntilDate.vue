<template>
    <v-card class="pa-2">
        <v-card-title primary-title>
            {{dateSince | formattedDate}} - {{dateUntil | formattedDate}} | {{ selectedDateTypeText }}
        </v-card-title>
    </v-card>
</template>

<script>
    import {getSinceDateFromDateType, getUntilDateFromDateType, selectedDateTypeText} from './../helpers';

    export default {
        name: 'since-until-date',
        computed: {
            dateSince: function () {
                return getSinceDateFromDateType(this.$store.state.settings.dateType);
            },
            dateUntil: function () {
                return getUntilDateFromDateType(this.$store.state.settings.dateType);
            },
            selectedDateTypeText: function () {
                return selectedDateTypeText(this.$store.state.settings.dateType);
            }

        },
    }
</script>

<style scoped>
</style>
