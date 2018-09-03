<template>
    <div id="app">
        <since-until-date/>
        <repositories/>
        <token/>
        <choose-date-type/>
    </div>
</template>

<script>
    import Token from "./components/Token.vue"
    import Repositories from "./components/Ropositories";
    import ChooseDateType from "./components/ChooseDateType";
    import SinceUntilDate from "./components/SinceUntilDate";

    export default {
        name: 'app',
        components: {
            SinceUntilDate,
            ChooseDateType,
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
