<template>
  <div>
    <h1>Cookies!!!!!</h1>
    <b-row>
    <b-col v-for="cookie in cookies" :key="cookie.name" cols="12" md="4">
      <div class="cookie">
        <p> Domain:</p> {{cookie.domain}}
        <p> Name:</p> {{cookie.name}}
        <p> Expiration Date</p> {{cookie.expirationDate}}
      </div>
    </b-col>
  </b-row>
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
