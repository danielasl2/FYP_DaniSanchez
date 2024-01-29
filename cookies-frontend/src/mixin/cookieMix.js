export const cookieMixin = {
  methods: {
    categorisedCookie(cookie) {
      if (cookie.secure) {
        return 'Secure Cookies';
      }
  
      if (cookie.name.includes('ad') || cookie.domain.includes('ad')) {
        return 'Advertising Cookies';
      }
      if (/ui|pref/.test(cookie.name)) {
        return 'UI and Preferences';
      }
      if (cookie.domain.includes('.com')) {
        return 'Commercial Cookies';
      }
      if (cookie.domain.includes('.org')) {
        return 'Organizational Cookies';
      }
  
      if (!('expirationDate' in cookie) || cookie.session) {
        return 'Session Cookies';
      }
      if ('expirationDate' in cookie) {
        return 'Persistent Cookies';
      }
  
      return 'General Cookies';
    },
    getColourForCategory(category){
      const colours = {
        'Advertising Cookies' :'#4BBD7E',
        'Secure Cookies': '#BAD6A3',
        'Session Cookies': '#F7E7AD',
        'Persistent Cookies': '#FFBADE',
        'UI and Preferences': '#9A92D4',
        'Commercial Cookies': '#100387',
        'Organizational Cookies': '#D84364',
        //'General Cookies': '',
      }
      console.log(`Colour for ${category}:`, colours[category]);
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
        'Commercial Cookies': [],
        'Organizational Cookies': [],
        //'General Cookies': [],
      };
      this.filteredCookies.forEach(cookie => {
        const category = this.categorisedCookie(cookie);
        categories[category].push(cookie);
      });
      return categories;
    },
    sessionCookies() {
      return this.cookies.filter(cookie => !cookie.expirationDate);
    },
    persistentCookies() {
      return this.cookies.filter(cookie => cookie.expirationDate);
    },
    secureCookies() {
      return this.cookies.filter(cookie => cookie.secure);
    },
    preferencesCookies() {
      return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'UI and Preferences');
    },
    
    chartData (){
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
