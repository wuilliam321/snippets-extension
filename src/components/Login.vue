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
  </form>
  <!-- Forgot Password -->
  <!-- New Account -->
</template>

<script>
import Vue from 'vue';
import Loader from './Loader.vue';
import form from '../lib/login.form';
import auth from '../lib/auth.service';

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

      if (!form.isValidForm(this.email, this.password)) {
        this.showError = true;
        return;
      }

      // hacer POST al login
      try {
        const data = await auth.login(this.email, this.password);
        // mostrar el dashboard con el boton logout, (no quiero el form)
        console.log('success', data);

        // guardar el token en la pc
        // TODO: move to a storage.service.js storage.set('token', token);
        chrome.storage.sync.set({ data: data.access_token }, () => {
          console.log('data saved');
        });
        this.$router.push('/dashboard');
        this.isLoading = false;
      } catch (err) {
        console.log('error', err.status);
        this.showError = true;
        this.isLoading = false;
      }
    },
  },
});
</script>
