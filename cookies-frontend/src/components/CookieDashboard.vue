<template>
  <div>
    <h1>Cookies!!!!!</h1>
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
    getCookies(url) {
      chrome.cookies.getAll({ url: url }, (cookies) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
        } else {
          this.cookies = cookies;
        }
      });
    }
  },
  mounted() {
    if (chrome && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          // Handle any errors that occur during the query
          console.error('Error querying tabs:', chrome.runtime.lastError);
          return;
        }
        if (tabs[0] && tabs[0].url) {
          this.getCookies(tabs[0].url);
        }
      });
    } else {
      console.error('chrome.tabs is not available');
    }
  }
};


</script>

<style scoped>
</style>
