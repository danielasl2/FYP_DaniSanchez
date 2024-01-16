<template>
  <div>
    <h1>Cookies!!!!!</h1>
    <b-list-group>
      <cookie-category
        v-for="(cookies, category) in categorisedCookies"
        :key="category"
        :category-name="category"
        :cookies="cookies"
        :cookie-fields="cookieFields"
        :collapse-id="`collapse-${category}`"
      />
    </b-list-group>
  </div>
</template>

<script>
import { cookieMixin } from '../mixin/cookieMix';
import CookieCategory from './CookiesCategory.vue';
import { formatExpirationDate } from '../reuse/utils';
//import ApiService from '../api';

export default {
  mixins: [cookieMixin],
  components:{
    CookieCategory
  },
  data() {
    return {
      cookies: [],
      currentDomain: null,
       cookieFields: [
        { key: 'domain', label: 'Website' },
        { key: 'expirationDate', label: 'Expiration Date' },
      ]
    };
  },
  methods: {
    formatExpirationDate,
    getAllCookies(callback) {
      if(!chrome || !chrome.cookies){
        console.error('chrome.cookies API is not available');
        return;
      }
      chrome.cookies.getAll({}, (cookies) => {
        if(chrome.runtime.lastError){
          console.error('Error: ', chrome.runtime.lastError);
        } else {
          this.cookies = cookies.map(cookie => ({
            ...cookie,
            expirationDate: this.formatExpirationDate(cookie.expirationDate)
          }));
          if(typeof callback === 'function'){
            callback();
          }
        }
      })
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
  },
  computed: {
    formattedCookies() {
      return this.cookies.map(cookie => ({
        ...cookie,
        expirationDate: this.formatExpirationDate(cookie.expirationDate),
        type: this.categorisedCookie(cookie)
      }));
    },
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
    this.getAllCookies(()=>{
      Object.keys(this.categorisedCookies).forEach(category =>{
      this.showGrid[category] = false;
      })
    });
  }
};


</script>

<style scoped>
</style>
