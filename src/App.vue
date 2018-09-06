<template>
    <div id="app">
        <since-until-date/>
        <repositories/>
        <display-settings/>
        <token/>
        <choose-date-type/>
    </div>
</template>

<script>
    import Token from "./components/Token.vue"
    import Repositories from "./components/Ropositories";
    import ChooseDateType from "./components/ChooseDateType";
    import SinceUntilDate from "./components/SinceUntilDate";
    import DisplaySettings from "./components/DisplaySettings";
    import store from './store/';

    export default {
        name: 'app',
        store,
        components: {
            DisplaySettings,
            SinceUntilDate,
            ChooseDateType,
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
