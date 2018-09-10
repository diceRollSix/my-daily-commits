<template>
    <div id="app">
        <user-avatar/>
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
    import UserAvatar from "./components/UserData";

    export default {
        name: 'app',
        store,
        components: {
            UserAvatar,
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
