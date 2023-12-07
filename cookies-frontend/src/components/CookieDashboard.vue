<template>
  <div>
    <h1>Cookies!!!!!</h1>
     <b-list-group>
      <!-- Persistent Cookies -->
    <b-list-group-item button @click="toggleCollapse('persistent')">
      Persistent Cookies ({{persistentCookies.length}})
    </b-list-group-item>
    <b-collapse v-for="(cookies, category) in visibleCategories" :key="'collapse-' + category" :id="'collapse-' + category">
  <b-card>
    <b-table :items="cookies" :fields="cookieFields"></b-table>
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

    <!-- Social Media Cookies -->
    <b-list-group-item button @click="toggleCollapse('social')">
      Social Media Cookies ({{socialMediaCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-social">
      <b-card>
      <b-table :items="socialMediaCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- Personalize Cookies -->
    <b-list-group-item button @click="toggleCollapse('personalize')">
    Personalised Cookies ({{contentPersonalizationCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-personalize">
      <b-card>
      <b-table :items="contentPersonalizationCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- Tracking Cookies -->
    <b-list-group-item button @click="toggleCollapse('affiliate')">
      Tracking Cookies ({{affiliateTrackingCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-affiliate">
      <b-card>
      <b-table :items="affiliateTrackingCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- User Session Cookies -->
    <b-list-group-item button @click="toggleCollapse('replay')">
     User Session Cookies ({{sessionReplayAndHeatmapCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-replay">
      <b-card>
      <b-table :items="sessionReplayAndHeatmapCookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>

    <!-- customer interaction Cookies -->
    <b-list-group-item button @click="toggleCollapse('customer')">
     Customer Interaction Cookies ({{customerInteractionCookies.length}})
    </b-list-group-item>
    <b-collapse id="collapse-customer">
      <b-card>
      <b-table :items="customerInteractionCookies" :fields="cookieFields"></b-table>
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
      showGrid: {},
      currentDomain: null,
       cookieFields: [
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
      this.$set(this.showGrid, category, !this.showGrid[category]);
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
    /* The code below identifies the type of cookie */
    categorisedCookie(cookie){
      let category = '';

      if(cookie.name.includes('ad') || cookie.domain.includes('ad')){
        category = 'Advertising';
      }else if (cookie.name.includes('analytic') || cookie.domain.includes('analytic')){
        category = 'Analytics';
      } else if (cookie.name.includes('social') || cookie.domain.includes('social')){
        category = 'Social Media';
      }  else if (cookie.name.includes('personalize') || cookie.domain.includes('personalize')){
        category = 'Content Personalisation';
      } else if (cookie.name.includes('affiliate') || cookie.domain.includes('affiliate')){
        category = 'Affiliate Tracking';
      } else if (cookie.name.includes('replay') || cookie.domain.includes('replay')){
        category = 'Session replay and Heatmap';
      } else if (cookie.name.includes('customer') || cookie.domain.includes('customer')){
        category = 'Customer Interaction';
      } else {
        category = 'Other'
      }
      if(!cookie.expirationDate){
        category += ' Session';
      } else {
        category += ' Persistent';
      } 
      if (cookie.secure){
        category += ' Secure';
      } 
      return category;
    },
    getCurrentDomain(){
      return new Promise((resolve, reject) =>{
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
    })
    },
    formatExpirationDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString(); 
    },
  },
  computed: {
    visibleCategories(){
      return Object.entries(this.categorisedCookies).filter(
        ([category]) => this.showGrid[category]
      );
    },
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
      return this.cookies.filter(cookie => !cookie.expirationDate);
    },
    persistentCookies(){
      return this.cookies.filter(cookie => cookie.expirationDate).map(cookie => ({
        ...cookie,
        expirationDate: this.formatExpirationDate(cookie.expirationDate)
      }));
    },
    advertisingCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Advertising'));
  },
  analyticsCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Analytics'));
  },
  socialMediaCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Social Media'));
  },
  contentPersonalizationCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Content Personalization'));
  },
  affiliateTrackingCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Affiliate Tracking'));
  },
  sessionReplayAndHeatmapCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Session Replay and Heatmap'));
  },
  customerInteractionCookies() {
    return this.cookies.filter(cookie => this.categorisedCookie(cookie).startsWith('Customer Interaction'));
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
  /* to show the grid under each category */
  created(){
    this.categorisedCookies.forEach((_, category) => {
    this.$set(this.showGrid, category, false);
  });
  }
};


</script>

<style scoped>
</style>
