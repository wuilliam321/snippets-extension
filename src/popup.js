import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
    { name: 'login', path: '/', component: Login },
    { name: 'dashboard', path: '/dashboard', component: Dashboard },
];

const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    chrome.storage.sync.get(['access_token', 'user', 'token_type'], function(result) {
        console.log('Value currently is ' + result.access_token);
        console.log('user', result.user);
        console.log('token_type', result.token_type);
        if (to.name === 'login' && result.access_token) {
            next({ name: 'dashboard' });
        } else {
            next();
        }
    });
});

Vue.use(VueRouter);

new Vue({
    render: (createElement) => createElement(App),
    router,
}).$mount('#app');