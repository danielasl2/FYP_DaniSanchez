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
  created() {
    chrome.cookies.getAll({ url: 'http://example.com' }, (retrievedCookies) => {
      this.cookies = retrievedCookies;
    });
  }
};
</script>

<style scoped>
/* Your CSS here */
</style>

  