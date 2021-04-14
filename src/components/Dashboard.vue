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

export default Vue.extend({
  mounted() {
    const load = async () => {
      await this.app.loadSnippets();
    };
    load();
    // TODO: we need in some way pull this in a polling
  },
  methods: {
    async doLogout(event) {
      event.preventDefault();
      try {
        await this.app.logout();
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
