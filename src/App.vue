<template>
    <v-app id="inspire">
        <v-toolbar color="black" dark fixed app>
            <v-toolbar-title>My Daily Commits</v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout
                        justify-center
                        align-center
                >
                    <v-flex text-xs-center>
                        <repositories/>
                        <load-button/>
                        <display-settings/>
                        <token/>
                        <choose-date-type/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
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
