<template>
  <div>
    <h1>Cookies</h1>
    <ul>
      <li v-for="cookie in cookies" :key="cookie.name">
        {{ cookie.name }}: {{ cookie.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cookies: []
    };
  },
  methods: {
    getCookies() {
      chrome.runtime.sendMessage({ action: "getCookies" }, (response) => {
        if (response && response.cookies) {
          this.cookies = response.cookies;
        }
      });
    }
  },
  created() {
    this.getCookies();
  }
};
</script>

<style scoped>
</style>
