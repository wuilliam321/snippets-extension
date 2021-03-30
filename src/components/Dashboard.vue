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
import settings from '../core/settings';
import storage from '../core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);

export default Vue.extend({
  async mounted() {
    // TODO: we need in some way pull this in a polling
    await cfg.fetchSnippets();
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
