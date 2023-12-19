<template>
  <div>
    <!-- Search Bar -->
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Cookies</b-navbar-brand>
            <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form @submit.prevent="filterCookies">
          <b-form-input 
            size="sm" 
            class="mr-sm-2" 
            placeholder="Search by name, domain, or expiration date" 
            v-model="searchQuery"
          ></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>

    <b-list-group>
      <cookie-category
        v-for="(cookies, category) in filteredCookies"
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
      ],
      searchQuery:''
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
    filteredCookies(){
      if(!this.searchQuery) return this.categorisedCookies;

      return Object.keys(this.categorisedCookies).reduce((filtered, category) => {
        const filteredCookies = this.categorisedCookies[category].filter(cookie =>
        cookie.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || cookie.domain.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        if (filteredCookies.length){
          filtered[category] = filteredCookies;
        }
        return filtered;
      }, {});
    },
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
