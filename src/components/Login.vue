<template>
  <form @submit="doLogin">
    <label for="email">Email Address</label>
    <input type="text" v-model="email" name="email" />
    <label for="password">Password</label>
    <input type="password" v-model="password" name="password" />
    <p v-if="showError">Incorrect Email or Password</p>
    <input type="submit" value="Log in" />
  </form>
</template>

<script>
import Vue from 'vue';
import form from '../lib/login.form';
import auth from '../lib/auth.service';

export default Vue.extend({
  data() {
    return {
      email: '',
      password: '',
      showError: false,
    };
  },
  methods: {
    async doLogin(event) {
      event.preventDefault();

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
        // chrome.storage.sync.set({ data: data.data.access_token }, () => {
        //   console.log(data.data.access_token);
        // });
        this.showError = false;
        this.$router.push('/dashboard');
      } catch (err) {
        console.log('error', err.status);
        this.showError = true;
      }
    },
  },
});
</script>
