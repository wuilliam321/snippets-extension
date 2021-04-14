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

router.beforeEach((to, _, next) => {
  // chrome.storage.sync.get(['auth'], function ({ auth }) {
  //   console.log('beforeEach', auth, to);
  //   if (to.name === 'login' && auth && auth.access_token) {
  //     next({ name: 'dashboard' });
  //   } else {
      next();
  //   }
  // });
});

Vue.use(VueRouter);

new Vue({
  render: (createElement) => createElement(App),
  router,
}).$mount('#app');
