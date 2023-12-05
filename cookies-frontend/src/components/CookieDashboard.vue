<template>
  <div>
    <h1>Cookies!!!!!</h1>
       <b-table :items="formattedCookies" :fields="fields"></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cookies: [],
      currentDomain: null,
       fields: [
        { key: 'domain', label: 'Website' },
        { key: 'name', label: 'Cookie Name' },
        { key: 'expirationDate', label: 'Expiration Date' },
        { key: 'type', label: 'Category'}
      ]
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
    },
    categorisedCookie(cookie){
      if(!cookie.expirationDate){
        return 'Session';
      } else if (cookie.expirationDate){
        return 'Persistent';
      } else if (cookie.secure){
        return 'Secure';
      } else if ( cookie.domain === this.currentDomain){
        return 'First-Party';
      } else {
        return 'Third-Party';
      }
    },
    getCurrentDomain(){
      return new Promise((resolve, reject) =>[
        chrome.tabs.query({active:true, currentWindow: true}, (tabs) => {
          if (chrome.runtime.lastError){
            reject(chrome.runtime.lastError);
          }else if (tabs[0] && tabs[0].url){
            const url = new URL (tabs[0].url);
            const domain = url.hostname;
            resolve(domain);
          }else {
            resolve (null);
          }
        })
      ])
    },
    formatExpirationDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString(); 
    }, 
  },
  computed: {
    formattedCookies() {
      return this.cookies.map(cookie => ({
        ...cookie,
        expirationDate: this.formatExpirationDate(cookie.expirationDate),
        type: this.categorisedCookie(cookie)
      }));
    },
    sessionCookies() {
      return this.cookie.filter(cookie => !cookie.expirationDate);
    },
    persistentCookies(){
      return this.cookies.filter(cookie => cookie.expirationDate);
    },
    firstPartyCookies() {
     // const currentDomain = this.getCurrentDomain();
      return this.cookies.filter(cookie => cookie.domain === this.currentDomain);
    },
    thirdPartyCookies(){
      return this.cookies.filter(cookie => cookie.domain != this.currentDomain);
    },
    secureCookies(){
      return this.cookies.filter(cookie => cookie.secure);
    }
  },
  mounted() {
    this.getAllCookies();
    this.getCurrentDomain().then(domain => {
      this.currentDomain = domain;
    }).catch(error =>{
      console.error('Error', error);
    })
  }
  }
</script>

<style scoped>
</style>
