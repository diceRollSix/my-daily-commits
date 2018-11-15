import Vue from 'vue'
import App from './App'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false;

function padStart(input, length, symbol = ' ') {
    let str = input.toString();

    while (str.length < length) {
        str = symbol + str;
    }

    return str;
}

Vue.filter('formattedDate', function (dateTimeString) {
    const date = new Date(dateTimeString);

    const dateString = padStart(date.getDate(), 2, '0') + '.' + padStart(date.getMonth() + 1, 2, '0') + '.' + date.getFullYear();
    const timeString = padStart(date.getHours(), 2, '0') + ':' + padStart(date.getMinutes(), 2, '0') + ':' + padStart(date.getSeconds(), 2, '0');
    const offset = -date.getTimezoneOffset();
    const timezoneString = 'GMT' + (offset > 0 ? '+' : '-') + (offset / 60).toString();

    return dateString + ' ' + timeString + ' ' + timezoneString;
});

Vue.filter('shortDate', function (dateTimeString) {
    const date = new Date(dateTimeString);

    const dayDiff = (new Date()).getDate() - date.getDate();
    if (dayDiff > 1) {
        return dayDiff + ' day' + (dayDiff === 1 ? '' : 's') + ' ago';
    }

    return padStart(date.getHours(), 2, '0') + ':' + padStart(date.getMinutes(), 2, '0');
});


Vue.use(Vuetify, {
    theme: {
        primary: '#000000',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c'
    }
});

new Vue({
    el: '#app',
    store,
    render: createElement => createElement(App)
});
