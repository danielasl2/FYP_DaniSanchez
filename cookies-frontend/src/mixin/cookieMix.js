import { cookieUtil } from './cookieUtil';

export const cookieMix= {
  computed: 
  {
    userId(){
      return this.$store.state.userId;
    },
    categorisedCookies() {
      const categories = {
        'Advertising Cookies': [],
        'Secure Cookies': [],
        'Session Cookies': [],
        'Persistent Cookies': [],
        'UI and Preferences': [],
        'Performance and Analytics Cookies': [],
        'Social Media Cookies': [],
        'Tracking Cookies': [],
        'Necessary Cookies': [],
        'Customization Cookies': [],
      };
     // console.log("Filtered Cookies: ", cookieUtil.filteredCookies);
      this.filteredCookies.forEach(cookie => {
        const category = cookieUtil.categorisedCookie(cookie);
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(cookie);
      });
      return categories;
    },
    chartData() {
      const data = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }]
      };
      Object.keys(this.categorisedCookies).forEach(category => {
        data.labels.push(category);
        data.datasets[0].data.push(this.categorisedCookies[category].length);
        data.datasets[0].backgroundColor.push(this.getColourForCategory(category));
      });
      return data;
    }
  }
};
