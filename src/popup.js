import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

import CapijzoApp from './core/app';
import Api from './core/api';
import Storage from './core/storage';

import App from './components/App.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

const store = Storage({ service: chrome.storage.sync });

const routes = [
  { name: 'login', path: '/', component: Login },
  { name: 'dashboard', path: '/dashboard', component: Dashboard },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, _, next) => {
  const { auth } = await store.get('auth');
  if (to.name === 'login' && auth && auth.access_token) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

Vue.use(VueRouter);

axios.interceptors.request.use(async (config) => {
  const { auth } = await store.get('auth');
  if (auth) {
    config.headers.Authorization = auth.token_type + ' ' + auth.access_token;
  }
  return config;
});

const api = Api({ http: axios });
const options = { store, api };
const app = CapijzoApp(options);

Vue.mixin({
  data: function () {
    return { app: app };
  },
});

new Vue({
  render: (createElement) => createElement(App),
  router,
}).$mount('#app');
