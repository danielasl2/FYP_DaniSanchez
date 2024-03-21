import cookiesType from '../components/cookiesType.json';


export const cookieUtil =  {
    categorisedCookie(cookie) {
      for (const category of cookiesType) {
        if (category.secure && cookie.secure) {
          return category.cookie_type;
        }
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
        // Session, persistent and secure cookies
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

    loadCookiesType: async () => {
      console.log('Loading cookie types...');
  },
}