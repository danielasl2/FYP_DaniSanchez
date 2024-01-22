<template>
  <div>
    <h1>Cookies!!!!!</h1>
        <b-form-input v-model="filterDomain" placeholder="Filter by domain"></b-form-input>
    <b-list-group>
      <cookie-category
        v-for="(cookies, category) in categorisedCookies"
        :key="category"
        :category-name="category"
        :cookies="cookies"
        :cookie-fields="cookieFields"
        :collapse-id="`collapse-${category}`"
        @update-block-status="handleBlockStatusUpdate"
      />
    </b-list-group>
  </div>
</template>

<script>
import { cookieMixin } from '../mixin/cookieMix';
import CookieCategory from './CookiesCategory.vue';
import { formatExpirationDate } from '../reuse/utils';
import axios from 'axios';
import api from '../api';
const { API_URL} = api;

export default {
  mixins: [cookieMixin],
  components:{
    CookieCategory
  },
  data() {
    return {
      cookies: [],
      currentDomain: null,
      filterDomain:'',
       cookieFields: [
        { key: 'domain', label: 'Website' },
        { key: 'expirationDate', label: 'Expiration Date' },
        { key: 'blockToggle', label: 'Block/Unblock' }
      ]
    };
  },
  methods: {
    formatExpirationDate,
    async handleBlockStatusUpdate(updatedCookie){
      try {
        await axios.patch(`${API_URL}/api/cookies/block/${updatedCookie._id}`, {
          blockedStatus: updatedCookie.blockedStatus
          });
          } catch (error) {
            console.error('Error updating cookies status:', error);
            }
          },
    async getAllCookies() {
      try {
           const response = await axios.get('http://localhost:3000/api/cookies');
           this.cookies = response.data.map(cookie => ({
            ...cookie,
            expirationDate: this.formatExpirationDate(cookie.expirationDate)
           }))
           } catch (error) {
            console.error('Error fetching cookies from backend:', error);
            }
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
      if (!this.filterDomain){
        return this.cookies;
      }
      return this.cookies.filter(cookie => cookie.domain && cookie.domain.includes(this.filterDomain.toLowerCase()));
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
    this.$store.dispatch('fetchCookies');
    this.getAllCookies();
    this.getCurrentDomain().then(domain => {
      this.currentDomain = domain;
      console.log("Current Domain: ", this.currentDomain);
    }).catch(error =>{
      console.error('Error', error);
    })
  },
  created(){
    this.getAllCookies(()=>{
      Object.keys(this.categorisedCookies).forEach(category =>{
      this.showGrid[category] = false;
      })
    });
    this.$store.dispatch('fetchCookies');
  }
};


</script>

<style scoped>
</style>
