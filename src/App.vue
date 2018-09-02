<template>
    <div id="app">
        <since-date/>
        <repositories/>
        <token/>
        <choose-date-type/>
    </div>
</template>

<script>
    import Token from './components/Token.vue'
    import Repositories from "./components/Ropositories";
    import ChooseDateType from "./components/ChooseDateType";
    import SinceDate from "./components/SinceDate";

    export default {
        name: 'app',
        components: {
            SinceDate,
            ChooseDateType,
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
