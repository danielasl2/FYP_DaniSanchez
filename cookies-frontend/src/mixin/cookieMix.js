export const cookieMixin = {
  methods: {
    categorisedCookie(cookie) {
      // Check for specific cookie properties first
      if (cookie.httpOnly) {
        return 'HttpOnly Cookies';
      }
      if (cookie.secure) {
        return 'Secure Cookies';
      }
  
      // Categorize based on cookie names and domains
      if (cookie.name.includes('ad') || cookie.domain.includes('ad')) {
        return 'Advertising';
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
  
      // Check if the cookie is persistent or session-based
      if (!('expirationDate' in cookie) || cookie.session) {
        return 'Session Cookies';
      }
      if ('expirationDate' in cookie) {
        return 'Persistent Cookies';
      }
  
      // Default category
      return 'General Cookies';
    },
  },
  computed: {
    categorisedCookies() {
      const categories = {
        'Advertising': [],
        'HttpOnly Cookies': [],
        'Secure Cookies': [],
        'Session Cookies': [],
        'Persistent Cookies': [],
        'UI and Preferences': [],
        'Commercial Cookies': [],
        'Organizational Cookies': [],
        'General Cookies': [],
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
    loadBalancingCookies() {
      return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Load Balancing');
    },
    userInterfaceCookies() {
      return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'User Interface');
    },
    securityCookies() {
      return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Security');
    },
    complianceCookies() {
      return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Compliance');
    },
    // ... additional computed properties for other categories
  }
};
