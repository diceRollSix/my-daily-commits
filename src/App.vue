<template>
    <div id="app">
        <loading/>
        <errors/>
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
    import store from "./store/";
    import UserAvatar from "./components/UserData";
    import Errors from "./components/Errors";
    import Loading from "./components/Loading";

    export default {
        name: 'app',
        store,
        components: {
            Loading,
            Errors,
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
