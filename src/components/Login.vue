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
    <!-- <button type="button" @click="testPost">Test Message</button> -->
    <p>New Here? <a href="https://app.capijzo.com/register" target="_blank">Create Account</a></p>
  </form>
  <!-- Forgot Password -->
  <!-- New Account -->
</template>

<script>
import Vue from 'vue';
import Loader from './Loader.vue';
import validator from '../core/validator';
import api from '../core/api';

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
//    testPost() {
//      console.log('llamando testPost');
//      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//        chrome.tabs.sendMessage(tabs[0].id, { action: 'open_dialog_box' }, function (response) {});
//      });
//    },
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
        const data = await api.login(this.email, this.password);
        // mostrar el dashboard con el boton logout, (no quiero el form)

        // guardar el token en la pc
        // TODO: move to a storage.service.js storage.set('token', token);
        chrome.storage.sync.set({ access_token: data.access_token }, () => {
        });
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
