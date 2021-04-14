<template>
  <!-- Header -->
  <!--   Profile -->
  <!--   Add Button -->
  <!-- Productivity Stats -->
  <!--   Hours Saved -->
  <!--   Typing Speed -->
  <!--   Inserted Words -->
  <!-- Footer -->
  <a href="#" @click="doLogout">Log out</a>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import App from '../core/app';
import Api from '../core/api';

const options = {
  store: chrome.storage.sync,
  api: Api({ store: chrome.storage.sync, http: axios }),
};
const app = App(options); // TODO: move it to a global scope

export default Vue.extend({
  mounted() {
    const load = async () => {
      await app.loadSnippets();
    };
    load();
    // TODO: we need in some way pull this in a polling
  },
  methods: {
    async doLogout(event) {
      event.preventDefault();
      try {
        await app.logout();
        this.$router.push('/');
      } catch (err) {
        this.$router.push('/');
      }

      // Here will go the logout process
      // Remove token
      // Remove all settings
      // Send back to login page
    },
  },
});
</script>
