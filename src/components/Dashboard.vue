<template>
  <div class="container">
    <!-- Header -->
    <Header></Header>
    <!-- Productivity Stats -->
    <ProductivityStats></ProductivityStats>
    <!--   Hours Saved -->
    <!--   Typing Speed -->
    <!--   Inserted Words -->
    <!-- Footer -->
    <!--<Footer></Footer>-->
    <div class="row">
      <div class="col">
        <a href="#" @click="doLogout">Log out</a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import settings from '../core/settings';
import storage from '../core/storage';
import Header from '../components/Header';
import ProductivityStats from '../components/ProductivityStats';

const store = storage(chrome.storage.sync);
const cfg = settings(store);

export default Vue.extend({
  components: {
    Header,
    ProductivityStats,
  },
  async mounted() {
    // TODO: we need in some way pull this in a polling
    await cfg.fetchSnippets();
    await cfg.fetchUserInfo();
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
