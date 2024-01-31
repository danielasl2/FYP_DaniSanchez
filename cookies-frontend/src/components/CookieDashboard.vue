<template>
  <div>
    <!-- Navbar -->
    <b-navbar type="dark" variant="light">
      <b-navbar-brand href="#">Cookies</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#" @click.prevent="showCharts = !showCharts">Charts</b-nav-item>
          <b-nav-item href="#">Cookies key</b-nav-item>
        </b-navbar-nav>

        <!-- Filter bar -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" v-model="filterDomain" placeholder="Search or Filter by Domain"></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Charts Section (Shown when 'Charts' is clicked) -->
    <div v-if="showCharts" class="chart-container">
      <cookie-charts :chart-data="chartData"></cookie-charts>
    </div>

    <!-- List of Categorised Cookies -->
    <div class="list-container">
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
  </div>
</template>


<script>
import { cookieMixin } from '../mixin/cookieMix';
import CookieCategory from './CookiesCategory.vue';
import { formatExpirationDate } from '../reuse/utils';
import axios from 'axios';
import CookieCharts from './CookieCharts.vue';

export default {
  mixins: [cookieMixin],
  components: {
    CookieCategory,
    CookieCharts
  },
  data() {
    return {
      showCharts:false,
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
