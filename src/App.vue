<template>
    <div id="app">
        <repositories/>
        <token/>
    </div>
</template>

<script>
    import Token from './components/Token.vue'
    import Repositories from "./components/Ropositories";

    export default {
        name: 'app',
        components: {
            Repositories,
            Token
        }
    }
</script>

<style>
</style>
