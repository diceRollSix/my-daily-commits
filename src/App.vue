<template>
    <div id="app">
        <repositories/>
        <load-button/>
        <display-settings/>
        <token/>
        <choose-date-type/>
    </div>
</template>

<script>
    import Token from "./components/Token"
    import Repositories from "./components/Ropositories";
    import ChooseDateType from "./components/ChooseDateType";
    import DisplaySettings from "./components/DisplaySettings";
    import store from "./store/";
    import LoadButton from "./components/LoadButton";

    export default {
        name: 'app',
        store,
        components: {
            LoadButton,
            DisplaySettings,
            ChooseDateType,
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
