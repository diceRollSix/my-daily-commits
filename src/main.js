import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false;

function padStart(input, length, symbol = ' ') {
    let str = input.toString();

    while (str.length < length) {
        str = symbol + str
    }

    return str
}

Vue.filter('formattedDate', function (dateTimeString) {
    let date = new Date(dateTimeString);

    let dateString = date.getDate() + '.' + padStart(date.getMonth() + 1, 2, '0') + '.' + date.getFullYear();
    let timeString = padStart(date.getHours(), 2, '0') + ':' + padStart(date.getMinutes(), 2, '0') + ':' + padStart(date.getSeconds(), 2, '0');
    let offset = -date.getTimezoneOffset();
    let timezoneString = 'GMT' + (offset > 0 ? '+' : '-') + (offset / 60).toString();
    return dateString + ' ' + timeString + ' ' + timezoneString;
});


new Vue({
    el: '#app',
    store,
    render: createElement => createElement(App)
});
