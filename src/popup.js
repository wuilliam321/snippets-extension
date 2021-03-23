import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/App.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
];

const router = new VueRouter({
  routes,
});

Vue.use(VueRouter);

new Vue({
  render: (createElement) => createElement(App),
  router,
}).$mount('#app');
