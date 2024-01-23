export const cookieMixin = {
    methods: {
      categorisedCookie(cookie) {

        // HttpOnly Cookies: Cookies that cannot be accessed through client-side scripts
        if (cookie.httpOnly) {
            return 'HttpOnly Cookies';
        }

        // Secure Cookies: Cookies that are marked as secure (usually sent over HTTPS)
        if (cookie.secure) {
            return 'Secure Cookies';
        }

        // Session Cookies: Cookies without a specified expiration date (they expire when the session ends)
        if (!cookie.expirationDate) {
            return 'Session Cookies';
        }

        // Persistent Cookies: Cookies with a specified expiration date
        if (cookie.expirationDate) {
            return 'Persistent Cookies';
        }

        // UI and Preferences: Cookies that contain 'ui' or 'pref' in their name
        if (cookie.name.includes('ui') || cookie.name.includes('pref')) {
            return 'UI and Preferences';
        }

        // Domain-Specific Categories
        if (cookie.domain.includes('.com')) {
            return 'Commercial Cookies';
        }

        if (cookie.domain.includes('.org')) {
            return 'Organizational Cookies';
        }

        // Default category for cookies that don't match any specific rule
        return 'General Cookies';
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
            if (category && categories[category]) {
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