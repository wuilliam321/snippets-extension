<template>
  <!-- Header -->
  <!--   Profile -->
  <!--   Add Button -->
  <!-- Productivity Stats -->
  <!--   Hours Saved -->
  <!--   Typing Speed -->
  <!--   Inserted Words -->
  <!-- Footer -->
  <router-link to="/">Log out</router-link>
</template>

<script>
import Vue from 'vue';

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
