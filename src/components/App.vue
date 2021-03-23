<template>
  <div>
    <div>Hello {{ bundler }}</div>
    <Login></Login>
  </div>
</template>

<script>
import Vue from 'vue';
import Login from './Login.vue';

export default Vue.extend({
  components: {
    Login,
  },
  data() {
    return {
      bundler: 'World',
    };
  },
});
</script>
