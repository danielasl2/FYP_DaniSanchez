<template>
  <div>
    <h1>Cookies</h1>
    <div v-for="(cookies, domain) in groupingCookies" :key="domain">
      <h2> {{domain}}</h2>
      <b-table striped hover :items="cookiesGrid(cookies)"></b-table>
      <!--
    <ul>
      <li v-for="cookie in cookies" :key="cookie.name">
          <p>Name: </p> {{cookie.name}},
          <p>Path: </p> {{cookie.path}},
          <p>Secure: </p> {{cookie.secure}}
      </li>
    </ul>
    -->
    </div>
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
    },
   cookiesGrid(cookies){
      return cookies.map(cookie => ({
        name: cookie.name,
        path: cookie.path,
        secure: cookie.secure
      }));
    }
  },
  //Cookies are being grouped into their domains
  computed: {
    groupingCookies(){
      const grouping ={};
      this.cookies.forEach(cookie => {
        if(!grouping[cookie.domain]){
          grouping[cookie.domain] = [];
        }
        grouping[cookie.domain].push(cookie);
      });
      return grouping;
    }
  },
  mounted() {
    if (chrome && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
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
  },
};


</script>

<style scoped>
</style>
