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
    getAllCookies() {
      chrome.cookies.getAll({}, (cookies) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
        } else {
          this.cookies = cookies;
        }
      });
    }
  },
  mounted() {
   this.getAllCookies();
  }
};


</script>

<style scoped>
</style>
