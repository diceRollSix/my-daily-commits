<template>
    <v-card
            v-if="this.selectedDateType"
    >
        <v-card-title primary-title>
            {{dateSince | formattedDate}} - {{dateUntil | formattedDate}}
        </v-card-title>
    </v-card>

</template>

<script>
    import {mapState} from 'vuex'
    import {getSinceDateFromDateType, getUntilDateFromDateType} from './../helpers';

    export default {
        name: 'selected-since-until-date',
        computed: {
            ...mapState({
                selectedDateType: state => state.repositories.selectedDateType,
            }),

            dateSince: function () {
                return getSinceDateFromDateType(this.selectedDateType);
            },
            dateUntil: function () {
                return getUntilDateFromDateType(this.selectedDateType);
            }
        },
    }
</script>

<style scoped>
</style>
