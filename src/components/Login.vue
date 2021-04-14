<template>
  <!-- Header -->
  <!--   Logo -->
  <!--   Title -->
  <!-- Social Login -->
  <!-- Form Login -->
  <form @submit="doLogin">
    <label for="email">Email Address</label>
    <input type="text" v-model="email" name="email" :disabled="isLoading" />
    <label for="password">Password</label>
    <input type="password" v-model="password" name="password" :disabled="isLoading" />
    <template v-if="showError">
      <p>Incorrect Email or Password</p>
    </template>
    <template v-if="isLoading">
      <Loader></Loader>
    </template>
    <input type="submit" value="Log in" :disabled="isLoading" />
    <p>New Here? <a href="https://app.capijzo.com/register" target="_blank">Create Account</a></p>
  </form>
  <!-- Forgot Password -->
  <!-- New Account -->
</template>

<script>
import Vue from 'vue';
import axios from 'axios'; // TODO move it out here
import Loader from './Loader.vue';
import validator from '../core/validator';
import App from '../core/app';
import Api from '../core/api';
import Storage from '../core/storage';

const store = Storage({ service: chrome.storage.sync });

axios.interceptors.request.use(async (config) => {
  const { auth } = await store.get('auth');
  config.headers.Authorization = auth.token_type + ' ' + auth.access_token;
  return config;
});

const options = {
  store: store,
  api: Api({ http: axios }),
};
const app = App(options); // TODO: move it to a global scope

export default Vue.extend({
  components: {
    Loader,
  },
  data() {
    return {
      email: '',
      password: '',
      showError: false,
      isLoading: false,
    };
  },
  methods: {
    async doLogin(event) {
      event.preventDefault();
      if (!validator.isValidForm(this.email, this.password)) {
        this.showError = true;
        return;
      }

      this.isLoading = true;
      this.showError = false;
      try {
        await app.login(this.email, this.password);

        this.$router.push('/dashboard');
        this.isLoading = false;
      } catch (err) {
        console.error('err', err);
        this.showError = true;
        this.isLoading = false;
      }
    },
  },
});
</script>
