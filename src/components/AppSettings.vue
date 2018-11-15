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
                    right
                    id="settings-button"
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
            </v-toolbar>

            <div>
                <display-settings/>
                <token/>
                <since-until-date/>
                <choose-date-type/>
            </div>

        </v-card>
    </v-dialog>
</template>

<script>
    import Token from "./Token"
    import ChooseDateType from "./ChooseDateType";
    import DisplaySettings from "./DisplaySettings";
    import SinceUntilDate from "./SinceUntilDate";

    export default {
        name: 'app-settings',
        data() {
            return {
                appSettingsDialog: false,
            }
        },
        components: {
            SinceUntilDate,
            DisplaySettings,
            ChooseDateType,
            Token
        }
    }
</script>

<style>
    #settings-button.v-btn--bottom:not(.v-btn--absolute) {
        bottom: 90px;
    }
</style>
