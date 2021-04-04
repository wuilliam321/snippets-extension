<template>
  <div class="row">
    <div class="col">
      <p>Today's Productivity</p>
    </div>
    <div class="col">
      <a href="https://app.capijzo.com/dashboard">Go To Dashboard</a>
    </div>
    <div class="row">
      <div class="col">
        <p>Total hours saved</p>
        <p>{{ stats.totalHours + ' Hours' }}</p>
      </div>
      <div class="col">
        <p>Typing speed</p>
        <p>{{ stats.typingSpeed + ' WPM' }}</p>
      </div>
      <div class="col">
        <p>Inserted Words</p>
        <p>{{ stats.insertedWords + ' K' }}</p>
      </div>
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
    const userProductivity = await cfg.getUserInfo();
    this.stats.totalHours = userProductivity.productivity.hours;
    this.stats.typingSpeed = userProductivity.productivity.wpms;
    this.stats.insertedWords = userProductivity.productivity.words;
    console.log('hola', userProductivity.productivity);
  },
  data() {
    return {
      stats: {
        totalHours: '',
        typingSpeed: '',
        insertedWords: '',
      },
    };
  },
});
</script>
