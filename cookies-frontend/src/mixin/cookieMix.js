export const cookieMix= {
  computed: 
  {
    categorisedCookies() {
      const categories = {
        'Advertising Cookies': [],
        'Secure Cookies': [],
        'Session Cookies': [],
        'Persistent Cookies': [],
        'UI and Preferences': [],
        'Performance and Analytics Cookies': [],
       // 'Functional Cookies': [],
        'Social Media Cookies': [],
       // 'HttpOnly Cookies': [],
        'Tracking Cookies': [],
        'Necessary Cookies': [],
        'Customization Cookies': [],
      };
      this.filteredCookies.forEach(cookie => {
        const category = this.categorisedCookie(cookie);
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
