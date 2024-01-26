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

export default {
  mixins: [cookieMixin],
  components: {
    CookieCategory
  },
  data() {
    return {
      lastUpdateTimestamp: 0,
      updateInterval: 100,
      allCookies: {},
      cookies: [],
      currentDomain: null,
      filterDomain: '',
      cookieFields: [
        { key: 'domain', label: 'Website' },
        { key: 'expirationDate', label: 'Expiration Date' },
        { key: 'blockToggle', label: 'Block/Unblock' }
      ]
    };
  },
  methods: {
    shouldSendUpdate() {
      const now = Date.now();
      if (now - this.lastUpdateTimestamp > this.updateInterval) {
        this.lastUpdateTimestamp = now;
        return true;
      }
      return false;
    },
    handleCookiesReceived(newCookies) {
      newCookies.forEach(cookie => {
        const formattedCookie = {
          ...cookie,
          expirationDate: this.formatExpirationDate(cookie.expirationDate)
        };

        const cookieId = `${cookie.domain}-${cookie.name}`; 
        this.allCookies[cookieId] = formattedCookie;
      });

      this.cookies = Object.values(this.allCookies);
    },
    formatExpirationDate,
    async handleBlockStatusUpdate(updatedCookie) {
      try {
        await axios.patch(`http://localhost:3000/api/cookies/block/${updatedCookie._id}`, {
          blockedStatus: !updatedCookie.blockedStatus
        });
      } catch (error) {
        console.error('Error updating cookie status:', error);
      }
    },
    async getAllCookies() {
      if (this.shouldSendUpdate()) {
        try {
          const response = await axios.get('http://localhost:3000/api/cookies');
          this.handleCookiesReceived(response.data);
        } catch (error) {
          console.error('Error fetching cookies from backend:', error);
        }
      }
    },
    getCurrentDomain() {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (tabs[0] && tabs[0].url) {
            const url = new URL(tabs[0].url);
            const domain = url.hostname;
            resolve(domain);
          } else {
            resolve(null);
          }
        });
      });
    },
  },
  computed: {
    filteredCookies() {
      if (!this.filterDomain) {
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
    this.getAllCookies();
    this.getCurrentDomain().then(domain => {
      this.currentDomain = domain;
      console.log("Current Domain: ", this.currentDomain);
    }).catch(error => {
      console.error('Error', error);
    });
  },
  created() {
    window.addEventListener("message", (event) => {
      if (event.source === window && event.data && event.data.type === "FROM_EXTENSION") {
        if (event.data.action === "displayCookies") {
          this.handleCookiesReceived(event.data.data.cookies);
        }
      }
    });
  }
};


</script>

<style scoped>
</style>
