<template>
  <div class="row">
    <div class="col">
      <img :src="user.photo" width="48px" />
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
import settings from '../core/settings';
import storage from '../core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);

export default Vue.extend({
  async mounted() {
    const userInfo = await cfg.getUserInfo();
    this.user.name = userInfo.name;
    this.user.photo = 'https://app.capijzo.com/' + userInfo.avatar;
  },
  data() {
    return {
      user: {
        name: '',
        photo: '',
      },
    };
  },
});
</script>
