<template>
    <v-app id="inspire">
        <v-toolbar
                color="primary"
                dark
                fixed
                app
        >
            <v-toolbar-title>My Daily Commits</v-toolbar-title>
            <v-spacer></v-spacer>
            <user-name/>
            <user-avatar/>
        </v-toolbar>
        <v-content>
            <v-layout align-left>
                <v-flex xs12 text-xs-left>

                    <loading/>
                    <errors/>
                    <selected-since-until-date/>

                    <repositories/>
                    <load-button/>
                    <app-settings/>
                </v-flex>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
    import Repositories from "./components/Repositories";
    import store from "./store/";
    import LoadButton from "./components/LoadButton";
    import AppSettings from "./components/AppSettings";
    import Loading from "./components/Loading";
    import Errors from "./components/Errors";
    import SelectedSinceUntilDate from "./components/SelectedSinceUntilDate";
    import UserName from "./components/UserData/UserName";
    import UserAvatar from "./components/UserData/UserAvatar";

    export default {
        name: 'app',
        store,
        components: {
            UserAvatar,
            UserName,
            SelectedSinceUntilDate,
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
