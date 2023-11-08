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
     updateCookies(newCookies) {
      this.cookies = newCookies; 
    }
  
  },
  created() {
    this.getCookies(); 
  }
};
</script>

<style scoped>
</style>
