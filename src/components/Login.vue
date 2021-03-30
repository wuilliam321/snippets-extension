<template>
  <!-- Header -->
  <!--   Logo -->
  <div class="container auth-section">
    <div class="row">
      <div class="col mt-5">
        <div class="login-logo text-center">
          <img src="../static/Capijzo-logo.svg" alt width="45" />
        </div>
      </div>
    </div>

    <!-- Title -->
    <div class="row">
      <div class="col">
        <p class="text-center text-center login-continue">Log in to continue</p>
      </div>
    </div>
    <!-- Social Login -->
    <div class="row">
      <div class="col">
        <button class="btn btn-default form-control">
          <img src="../static/facebook.png" width="20" alt />
          <span>Log in with Facebook</span>
        </button>
      </div>
      <div class="col">
        <button class="btn btn-default form-control">
          <img src="../static/google.png" width="20" alt />
          <span>Log in with Google</span>
        </button>
      </div>
    </div>
    <!-- Form Login -->
    <div class="row line-row">
      <div class="col-md-12 d-flex justify-content-between flex-wrap line-group">
        <div class="line"></div>
        <div class="line or">
          <p>or</p>
        </div>
        <div class="line"></div>
      </div>
    </div>
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
      <p>
        New Here?
        <a href="https://app.capijzo.com/register" target="_blank" id="newHere">Create Account</a>
      </p>
      <!-- <button type="button" @click="testPost">Test Message</button> -->
    </form>
    <!-- Forgot Password -->
    <!-- New Account -->
  </div>
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
        this.isLoading = false;
        this.showError = true;
        return;
      }

      // hacer POST al login
      try {
        const data = await api.login(this.email, this.password);
        // mostrar el dashboard con el boton logout, (no quiero el form)

        // guardar el token en la pc
        // TODO: move to a storage.service.js storage.set('token', token);
        chrome.storage.sync.set(
          { access_token: data.access_token, user: data.user, token_type: data.token_type },
          () => {},
        );
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
