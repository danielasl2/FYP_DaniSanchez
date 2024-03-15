import axios from 'axios';

export const cookieUtil =  {
  cookiesType: [],

  async loadCookiesType() {
    try {
      const response = await axios.get('../components/cookiesType.json'); 
      this.cookiesType = response.data;
      console.log('This is the data', response);
    } catch (error) {
      console.error('Error loading cookie configuration:', error);
    }
  },
    categorisedCookie(cookie) {
      for (const category of this.cookiesType) {
        // Based on cookie names
        if (category.cookie_names) {
          for (const name of category.cookie_names) {
            if (cookie.name && cookie.name.includes(name)) {
              return category.cookie_type;
            }
          }
        }
        // Based on cookie domains
        if (category.cookie_domains) {
          for (const domain of category.cookie_domains) {
            if (cookie.domain && cookie.domain.includes(domain)) {
              return category.cookie_type;
            }
          }
        }
        // Session and persistent cookies
        if (category.session && cookie.session) {
          return category.cookie_type;
        }
        if (category.persistent && 'expirationDate' in cookie) {
          return category.cookie_type;
        }
      }
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
        'Social Media Cookies': '#8AC6D1',
        'Tracking Cookies': '#E6E6EA',
        'Necessary Cookies':  '#A4C3B2',
        'Customization Cookies': '#8AC6D1' ,
      };
      return colours[category] || '#000000';
    }, 
}