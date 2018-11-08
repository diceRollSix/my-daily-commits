<template>
    <v-dialog
            v-model="appSettingsDialog"
            max-width="600px"
    >
        <v-fab-transition
                slot="activator"
        >
            <v-btn
                    color="orange"
                    dark
                    fab
                    fixed
                    bottom
                    left
            >
                <v-icon>settings</v-icon>
            </v-btn>
        </v-fab-transition>

        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="appSettingsDialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <display-settings/>
            <token/>
            <choose-date-type/>

        </v-card>
    </v-dialog>
</template>

<script>
    import Token from "./Token"
    import ChooseDateType from "./ChooseDateType";
    import DisplaySettings from "./DisplaySettings";

    export default {
        name: 'app-settings',
        data() {
            return {
                appSettingsDialog: false,
            }
        },
        components: {
            DisplaySettings,
            ChooseDateType,
            Token
        }
    }
</script>

<style>
</style>
