<template>
  <div class="row">
    <div class="col">
      <img src="http://oaeucom/a.jpg" width="48px" />
    </div>
    <div class="col">
      <p>Welcome Back</p>
      <p>{{ user.name }}</p>
    </div>
    <div class="col">
      <button class="btn btn-secondary">+ Add Snippet</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      user: {
        name: 'Enzedeen',
      },
    };
  },
});
</script>
