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
import api from '../core/api';

export default Vue.extend({
  async mounted() {
    const snippets = await api.getSnippets();
    const user = await api.getUser();
    console.log('hola', user);
  },
  methods: {
    async doLogout(event) {
      event.preventDefault();
      chrome.storage.sync.remove('access_token', () => {
        this.$router.push('/');
      });

      // Here will go the logout process
      // Remove token
      // Remove all settings
      // Send back to login page
    },
  },
});
</script>
