<template>
  <div>
    <h1>Cookies!!!!!</h1>
     <b-list-group>
      <!-- Persistent Cookies -->
    <b-list-group-item button @click="toggleCollapse('persistent')">
      Persistent Cookies ({{persistentCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-persistent">
      <b-card>
      <b-table :items="persistentCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!--Secure Cookies -->
    <b-list-group-item button @click="toggleCollapse('secure')">
      Secure Cookies ({{secureCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-secure">
      <b-card>
      <b-table :items="secureCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- Advertising Cookies -->
    <b-list-group-item button @click="toggleCollapse('advertising')">
      Advertising Cookies ({{advertisingCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-advertising">
      <b-card>
      <b-table :items="advertisingCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- Analytics Cookies -->
        <b-list-group-item button @click="toggleCollapse('analytics')">
      Analytics Cookies ({{analyticsCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-analyticss">
      <b-card>
      <b-table :items="analyticsCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>
  </b-list-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cookies: [],
      showPersistent: false,
      currentDomain: null,
       fields: [
        { key: 'domain', label: 'Website' },
        { key: 'name', label: 'Cookie Name' },
        { key: 'expirationDate', label: 'Expiration Date' },
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
    cookiesGrid(){
      return this.formattedCookies.map(cookie => ({
        domain:  cookie.domain,
        name: cookie.name,
        expirationDate: cookie.expirationDate,
        type: cookie.type
      }))
    },
    toggleCollapse(category){
      this.$root.$emit('bv::toggle::collapse', 'collapse-' + category);
      },
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
    }
  },
  computed: {
    categorisedCookies(){
      let categories = {};
      for (let cookie of this.cookies){
        let category = this.categorisedCookie(cookie);
        if (!categories[category]){
          categories[category] = [];
        }
        categories[category].push(cookie);
      }
      return categories;
    },
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
      return this.cookies.filter(cookie => cookie.expirationDate).map(cookie => ({
        ...cookie,
        expirationDate: this.formatExpirationDate(cookie.expirationDate)
      }));
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
  },
};


</script>

<style scoped>
</style>
