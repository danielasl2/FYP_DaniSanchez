<template>
  <div class="container">
    <!-- Navbar -->
    <b-navbar type="dark" variant="light">
      <b-navbar-brand href="#">Cookies Board</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="toggleKeySection">Key</b-nav-item>
        </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item href="#" @click.prevent="toggleCharts">Analytics</b-nav-item>
      <b-nav-form>
        <b-form-input size="sm" class="mr-sm-2" v-model="filterDomain" placeholder="Search Website"></b-form-input>
      </b-nav-form>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
     <div v-if="showKey" class="key-descriptions">
      <div v-for="(description, key) in cookieDescriptions" :key="key">
        <strong>{{ key }}:</strong> {{ description }}<br>
      </div>
    </div>



    <!-- Charts Section-->
    <div v-if="showCharts " class="chart-container">
      <doughnut-chart :chart-data="doughnutChartData"></doughnut-chart>
      <horizontal-bar-chart :chart-data="horizontalBarChartData"></horizontal-bar-chart>
      <bar-chart :chart-data="barChartData"></bar-chart>

    </div>

    <!-- List of Categorised Cookies -->
    <div class="list-container">
      <b-list-group>
        <cookie-category
          v-for="(cookies, category) in filteredCookies"
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
import { computed } from 'vue';
import {useStore} from 'vuex';
import CookieCategory from './CookiesCategory.vue';
import { formatExpirationDate } from '../reuse/utils';
import axios from 'axios';
import DoughnutChart from './charts/DoughnutChart.vue';
import HorizontalBarChart from './charts/HorizontalBChart.vue';
import BarChart from './charts/BarChart.vue';
import {cookieDescriptions} from './cookieDescriptions';
import { cookieUtil } from '../mixin/cookieUtil';
import { mapGetters } from 'vuex';



export default {
  name: 'CookieKey',
  components: {
    CookieCategory,
    DoughnutChart,
    HorizontalBarChart,
    BarChart
  },
  setup(){
    const store = useStore();
    const vuexCookies = computed(() => store.state.vuexCookies);
    return{
      vuexCookies
    };
  },
  data() {
    return {
      showKey: false,
      cookieDescriptions,
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
  toggleCharts() {
    this.showCharts = !this.showCharts;
        console.log('Toggling showCharts:', this.showCharts); 
  },
    async fetchAllCookies(){
      try{
        await this.$store.dispatch('fetchCookies');
        const fetchedCookies = this.vuexCookie.cookies; 
        if (Array.isArray(fetchedCookies)) {
      this.handleCookiesReceived(fetchedCookies);
    } else {
      console.error('Fetched cookies is not an array:', fetchedCookies);
    }
  } catch (error) {
    console.error('Error when fetching cookies from the frontend:', error);
  }
    },
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
      if (Array.isArray(newCookies)) {

    newCookies.forEach(cookie => {
      const formattedCookie = {
        ...cookie,
        expirationDate: formatExpirationDate(cookie.expirationDate)
      };
      const cookieId = `${cookie.domain}-${cookie.name}`; 
      this.allCookies[cookieId] = formattedCookie;
    });
    this.cookies = Object.values(this.allCookies); 
  } else {
    console.error('newCookies is not an array:', newCookies);
  }
},
    formatExpirationDate,
    async handleBlockStatusUpdate(cookie) {
       const userId = this.$store.state.userId;

        if (!userId) {
            return;
        }
        this.$store.dispatch('blockUnblockCookie', {
            cookieId: cookie._id,
            blockedStatus: !cookie.blockedStatus,
            userId: userId
        });
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
        horizontalBarChartData() {
    let blockedCount = 0;
    let unblockedCount = 0;

    Object.values(this.categorizedCookies).flat().forEach(cookie => {
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
        barChartData() {
    let domainCounts = {};
Object.values(this.categorizedCookies).flat().forEach(cookie => {
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
    categorizedCookies(){
      return this.$store.state.cookies;
    },
    vuexCookie(){
      return this.$store.state.cookies;
    },
    userId(){
      return this.$store.state.userId;
    },
        allFromCookies(){
      return this.$store.state.cookies;
    }, 
            ...mapGetters(['categorizedCookies', 'chartData']),

 doughnutChartData() {
    const chartData = this.chartData;
        return {
            labels: chartData.map(data => data.category),
            datasets: [{
                data: chartData.map(data => data.count),
                backgroundColor: chartData.map(data => cookieUtil.getColourForCategory(data.category)),
                hoverOffset: 4
            }]
        };
  },
    filteredCookies() {
      if (!this.filterDomain.trim()) {
      return this.allFromCookies;
    }
    let filtered = {};
    Object.entries(this.allFromCookies).forEach(([category, cookies]) => {
      let filteredCookies = cookies.filter(cookie => cookie.domain.toLowerCase().includes(this.filterDomain.toLowerCase()));
      if (filteredCookies.length > 0) {
        filtered[category] = filteredCookies;
      }
    });
    return filtered;
    },
    formattedCookies() {
      return this.cookies.map(cookie => ({
        ...cookie,
        expirationDate: formatExpirationDate(cookie.expirationDate),
        type: this.categorisedCookie(cookie)
      }));
    },
  },
  watch: {
    userId(newUserId, oldUserId) {
    if (newUserId !== oldUserId) {
      this.fetchAllCookies();
    }
  },
  vuexCookie(newVal) {
          console.log('vuexCookies updated', newVal);
          this.handleCookiesReceived(newVal);
        }
    
  },
  mounted() {
    this.$nextTick(() => {
    const fetchedCookies = this.vuexCookies; 
    console.log('Fetched cookies for processing:', fetchedCookies);
    if (fetchedCookies && fetchedCookies.length > 0) {
        this.handleCookiesReceived(fetchedCookies);
    }
});
    this.$store.dispatch('fetchUserId');
    this.$store.dispatch('fetchCookies');
    this.getCurrentDomain().then(domain => {
      this.currentDomain = domain;
      console.log("Current Domain: ", this.currentDomain);
    }).catch(error => {
      console.error('Error', error);
    });

  },
  created() {
      this.fetchAllCookies();
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
