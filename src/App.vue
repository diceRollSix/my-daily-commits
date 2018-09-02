<template>
    <div id="app">
        <repositories/>
        <token/>
        <choose-date-type/>
    </div>
</template>

<script>
    import Token from './components/Token.vue'
    import Repositories from "./components/Ropositories";
    import ChooseDateType from "./components/ChooseDateType";

    export default {
        name: 'app',
        components: {
            ChooseDateType,
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
