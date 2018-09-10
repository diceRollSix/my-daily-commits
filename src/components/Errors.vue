<template>
    <div v-if="errors.length > 0">
        <div
                v-for="error in errors"
                class="error"
        >{{ error }}
        </div>

    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'errors',
        computed: {
            ...mapState({
                errors: state => state.repositories.errors
            })
        }
    }
</script>

<style>
    .error {
        color: darkred;
        font-size: 22px;
        font-weight: bold;
    }
</style>
