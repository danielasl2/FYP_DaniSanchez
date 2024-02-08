<template>
  <div class="container">
    <!-- Navbar -->
    <b-navbar type="dark" variant="light">
      <b-navbar-brand href="#">Cookies Board</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="toggleKeySection">Key</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" @click.prevent="showCharts = !showCharts">Analytics</b-nav-item>
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" v-model="filterDomain" placeholder="Search or Filter by Domain"></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div v-if="showKey" class="key-descriptions">
      <div v-for="(description, key) in cookieDescriptions" :key="key">
        <strong>{{ key }}:</strong> {{ description }}<br>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="showCharts" class="chart-container">
      <doughnut-chart :chart-data="doughnutChartData"></doughnut-chart>
      <horizontal-bar-chart :chart-data="horizontalBarChartData"></horizontal-bar-chart>
      <bar-chart :chart-data="barChartData"></bar-chart>
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
import DoughnutChart from './charts/DoughnutChart.vue';
import HorizontalBarChart from './charts/HorizontalBChart.vue';
import BarChart from './charts/BarChart.vue';
import {cookieDescriptions} from './cookieDescriptions';


export default {
  name: 'CookieKey',
  mixins: [cookieMixin],
  components: {
    CookieCategory,
    DoughnutChart,
    HorizontalBarChart,
    BarChart
  },
  data() {
    return {
      showKey: false,
      cookieDescriptions: cookieDescriptions,
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
    toggleKeySection(){
      this.showKey =!this.showKey;
    },
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
    barChartData() {
    let domainCounts = {};
    this.cookies.forEach(cookie => {
      domainCounts[cookie.domain] = (domainCounts[cookie.domain] || 0) + 1;
    });

    return {
      labels: Object.keys(domainCounts),
      datasets: [{
        label: 'Number of Cookies',
        data: Object.values(domainCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  },
    horizontalBarChartData() {
    let blockedCount = 0;
    let unblockedCount = 0;

    this.cookies.forEach(cookie => {
      if (cookie.blockedStatus) {
        blockedCount++;
      } else {
        unblockedCount++;
      }
    });

    return {
      labels: ['Blocked', 'Unblocked'],
      datasets: [{
        label: 'Cookies',
        data: [blockedCount, unblockedCount],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }]
    };
  },
    doughnutChartData() {
    let categoryCounts = {};
    this.cookies.forEach(cookie => {
      let category = this.categorisedCookie(cookie);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: Object.keys(categoryCounts).map(category => this.getColourForCategory(category))
      }]
    };
  },
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
