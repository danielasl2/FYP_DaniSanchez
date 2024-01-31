export const cookieMixin = {
  methods: {
    categorisedCookie(cookie) {
      /*
      if (cookie.name.startsWith('httpOnly_')) {
        return 'HttpOnly Cookies';
      }
      */
      if (cookie.secure) {
        return 'Secure Cookies';
      }
      if (cookie.name.includes('sess') || cookie.name.includes('csrftoken')) {
        return 'Necessary Cookies';
    }    
      if (cookie.name.includes('track') || cookie.domain.includes('track')) {
        return 'Tracking Cookies';
      }
      if (cookie.name.includes('ad') || cookie.domain.includes('ad')) {
        return 'Advertising Cookies';
      }
      if (/ui|pref/.test(cookie.name)) {
        return 'UI and Preferences';
      }
      if (cookie.name.includes('analytics') || cookie.domain.includes('analytics')) {
        return 'Performance and Analytics Cookies';
      }
      if (cookie.domain.includes('instagram.com') || cookie.domain.includes('facebook.com') || cookie.domain.includes('twitter.com')) {
        return 'Social Media Cookies';
      }
      /*
      if (cookie.name.includes('func') || cookie.domain.includes('func')) {
        return 'Functional Cookies';
      }
      */
      if (cookie.session) {
        return 'Session Cookies';
      }
      if (cookie.name.includes('lang') || cookie.name.includes('region')) {
        return 'Customization Cookies';
    }
      if ('expirationDate' in cookie) {
        return 'Persistent Cookies';
      }
      // Fallback category
      return 'Other Cookies';
    },
    getColourForCategory(category) {
      const colours = {
        'Advertising Cookies': '#4BBD7E',
        'Secure Cookies': '#BAD6A3',
        'Session Cookies': '#F7E7AD',
        'Persistent Cookies': '#FFBADE',
        'UI and Preferences': '#9A92D4',
        'Performance and Analytics Cookies': '#F49FBC',
      //  'Functional Cookies': '#FDEBA7',
        'Social Media Cookies': '#8AC6D1',
       // 'HttpOnly Cookies': '#A4C3B2',
        'Tracking Cookies': '#E6E6EA',
        'Necessary Cookies':  '#A4C3B2',
        'Customization Cookies': '#8AC6D1' ,
      };
      return colours[category] || '#000000';
    }
  },
  computed: {
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
