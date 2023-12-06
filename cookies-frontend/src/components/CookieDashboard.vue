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
    identifyThirdPartyCookies(cookie){
      if (cookie.domain.includes ('ad') || cookie.name.includes('ad')){
        return 'Advertising';
      } else if (cookie.domain.includes('analytic') || cookie.name.includes('analytic')){
        return 'Analytics';
      } else if (cookie.domain.includes('social') || cookie.name.includes('social')){
        return 'Social Media';
      } else {
        return 'Other';
      }
    },
    categorisedCookie(cookie){
      let category = '';
      if(!cookie.expirationDate){
        category += ' Session';
      } else {
        category += ' Persistent';
      } 
      if (cookie.secure){
        category += ' Secure';
      } 
      const cookieDomain = cookie.domain.startsWith('.') ? cookie.domain.substring(1): cookie.domain;
      const pageDomain = this.currentDomain.startsWith('.') ? this.currentDomain.substring(1) : this.currentDomain;
      if (pageDomain.endsWith (cookieDomain)){
        category += ' First-Party';
      } else {
      category += `, Third-Party - ${this.identifyThirdPartyCookies(cookie)}`;
      }
      return category;
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
      console.log("Current Domain: ", this.currentDomain);
    }).catch(error =>{
      console.error('Error', error);
    })
  }
  }
</script>

<style scoped>
</style>
