<template>
  <router-link to="/">Log out</router-link>
</template>

<script>
import Vue from 'vue';
import form from '../lib/login.form';
import auth from '../lib/auth.service';

export default Vue.extend({
  methods: {
    async doLogout(event) {
      event.preventDefault();

      // Here will go the logout process
      // Remove token
      // Remove all settings
      // Send back to login page
    },
  },
});
</script>
