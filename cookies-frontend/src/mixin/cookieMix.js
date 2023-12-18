export const cookieMixin = {
    methods: {
        categorisedCookie(cookie){
            let category = null;
      
          if (cookie.name.includes('ad') || cookie.domain.includes('ad')) {
            category = 'Advertising';
          } else if (cookie.name.includes('analytic') || cookie.domain.includes('analytic')) {
            category = 'Analytics';
          } else if (cookie.name.includes('social') || cookie.domain.includes('social')) {
            category = 'Social Media';
          } else if (cookie.name.includes('personalize') || cookie.domain.includes('personalize')) {
            category = 'Content Personalization';
          } else if (cookie.name.includes('affiliate') || cookie.domain.includes('affiliate')) {
            category = 'Affiliate Tracking';
          } else if (cookie.name.includes('replay') || cookie.domain.includes('replay')) {
            category = 'Session Replay and Heatmap';
          } else if (cookie.name.includes('customer') || cookie.domain.includes('customer')) {
            category = 'Customer Interaction';
          }
      
          if (category) {
            category += cookie.expirationDate ? ' Persistent' : ' Session';
            category += cookie.secure ? ' Secure' : '';
          }
            return category;
          },
    identifyThirdPartyCookies(cookie){
        if (cookie.domain.includes ('ad') || cookie.name.includes('ad')){
          return 'Advertising';
        } else if (cookie.domain.includes('analytic') || cookie.name.includes('analytic')){
          return 'Analytics';
        } else if (cookie.domain.includes('social') || cookie.name.includes('social')){
          return 'Social Media';
        } else {
          return 'Other';
        }
      },
    },
    computed: {
        categorisedCookies(){
            const categories = {
            'Advertising': [],
            'Analytics': [],
            'Social Media': [],
            'Content Personalization': [],
            'Affiliate Tracking': [],
            'Session Replay and Heatmap': [],
            'Customer Interaction': [],
          };
      
          for (let cookie of this.cookies) {
            let category = this.categorisedCookie(cookie);
            if (category) {
                if (!categories[category]) {
                categories[category] = []; 
              }
              categories[category].push(cookie);
            }
          }
            return categories;
          },
          sessionCookies() {
            return this.cookies.filter(cookie => !cookie.expirationDate);
          },
          persistentCookies(){
            return this.cookies.filter(cookie => cookie.expirationDate).map(cookie => ({
              ...cookie,
              expirationDate: this.formatExpirationDate(cookie.expirationDate)
            }));
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
          }
    }
  };