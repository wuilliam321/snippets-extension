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
import Loader from './Loader.vue';
import validator from '../core/validator';
import storage from '../core/storage';
import api from '../core/api';

const store = storage(chrome.storage.sync);

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
      this.isLoading = true;
      this.showError = false;

      if (!validator.isValidForm(this.email, this.password)) {
        this.showError = true;
        return;
      }

      // hacer POST al login
      try {
        const loginData = await api.login(this.email, this.password);
        await store.set('auth', { access_token: loginData.access_token, token_type: loginData.token_type });

        const userInfo = await api.userInfo();
        await store.set('userInfo', userInfo);

        // mostrar el dashboard con el boton logout, (no quiero el form)

        // guardar el token en la pc
        // TODO: move to a storage.service.js storage.set('token', token);
        console.log('loginData', loginData);
        console.log('userInfo', userInfo);

        this.$router.push('/dashboard');
        this.isLoading = false;
      } catch (err) {
        this.showError = true;
        this.isLoading = false;
      }
    },
  },
});
</script>
