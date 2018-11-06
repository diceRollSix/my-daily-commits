<template>
    <v-app id="inspire">
        <v-toolbar
                color="primary"
                dark
                fixed

                app
        >
            <v-toolbar-title>My Daily Commits</v-toolbar-title>

            <user-avatar/>

        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout
                        justify-center
                        align-center
                >
                    <v-flex text-xs-center>

                        <loading/>
                        <errors/>
                        <selected-since-until-date/>


                        <repositories/>
                        <load-button/>
                        <app-settings/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import Repositories from "./components/Ropositories";
    import store from "./store/";
    import LoadButton from "./components/LoadButton";
    import AppSettings from "./components/AppSettings";
    import Loading from "./components/Loading";
    import Errors from "./components/Errors";
    import UserAvatar from "./components/UserData";
    import SelectedSinceUntilDate from "./components/SelectedSinceUntilDate";


    export default {
        name: 'app',
        store,
        components: {
            SelectedSinceUntilDate,
            UserAvatar,
            Errors,
            Loading,
            AppSettings,
            LoadButton,
            Repositories,
        }
    }
</script>

<style>
</style>
