export const cookieMixin = {
    methods: {
      categorisedCookie(cookie) {
        if (cookie.httpOnly) {
          return 'HttpOnly Cookies';
        }
        if (cookie.secure) {
          return 'Secure Cookies';
        }
        if (!('expirationDate' in cookie) || cookie.session) {
          return 'Session Cookies';
        }
        if ('expirationDate' in cookie) {
          return 'Persistent Cookies';
        }
        if (/ui|pref/.test(cookie.name)) {
          return 'UI and Preferences';
        }
        // Add more categories as needed
        if (cookie.domain.includes('.com')) {
          return 'Commercial Cookies';
        }
        if (cookie.domain.includes('.org')) {
          return 'Organizational Cookies';
        }
        return 'General Cookies'; // Default category
      },
    },
    computed: {
      categorisedCookies() {
        const categories = {
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
        let category = this.categorisedCookie(cookie);
        if (categories[category]) {
          categories[category].push(cookie);
        }
      });
      return categories;
    },
          sessionCookies() {
            return this.cookies.filter(cookie => !cookie.expirationDate);
          },
          persistentCookies(){
            /*
            return this.cookies.filter(cookie => cookie.expirationDate).map(cookie => ({
              ...cookie,
              expirationDate: this.formatExpirationDate(cookie.expirationDate)
            }));
            */
           return this.cookies.filter(cookie => cookie.expirationDate)
          },
          advertisingCookies() {
           return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
          return category && category.includes('Advertising');
          });
          },
        analyticsCookies() {
            return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
            return category && category.includes('Analytics');
            });
        },
        socialMediaCookies() {
            return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
            return category && category.includes('Social Media');
            });
        },
        contentPersonalizationCookies() {
            return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
            return category && category.includes('Content Personalization');
            });
        },
        affiliateTrackingCookies() {
          return this.cookies.filter(cookie => {
            const name = cookie.name || '';
            const domain = cookie.domain || '';
            const category = this.categorisedCookie({ ...cookie, name, domain });
            return category && category.includes('Affiliate Tracking');
            });
        },
        sessionReplayAndHeatmapCookies() {
           return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
            return category && category.includes('Session Replay and Heatmap');
          });
        },
        customerInteractionCookies() {
          return this.cookies.filter(cookie => {
            const category = this.categorisedCookie(cookie);
            return category && category.includes('Customer Interaction');
          });
        },
          secureCookies(){
            return this.cookies.filter(cookie => cookie.secure);
          },
        preferencesCookies(){
          return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Preferences');
        },
        loadBalancingCookies(){
          return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Load Balancing');
        },
        userInterfaceCookies(){
          return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'User Interface');
        },
        securityCookies(){
          return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Security');
        },
        complianceCookies(){
          return this.cookies.filter(cookie => this.categorisedCookie(cookie) === 'Compliance');
        },
    }
  };