export const cookieMixin = {
    methods: {
        categorisedCookie(cookie){
          let category = null; 

          if (cookie.name.includes('ad') || cookie.domain.includes('ad')) {
            category = 'Advertising';
          /*} else if (cookie.name.includes('analytic') || cookie.domain.includes('analytic')) {
            category = 'Analytics'; */
          } else if (cookie.name.includes('social') || cookie.domain.includes('social')) {
            category = 'Social Media';
          } else if (cookie.name.includes('personalize') || cookie.domain.includes('personalize')) {
            category = 'Content Personalization';
          } else if (cookie.name.includes('affiliate') || cookie.domain.includes('affiliate')) {
            category = 'Affiliate Tracking';
          /*} else if (cookie.name.includes('replay') || cookie.domain.includes('replay')) {
            category = 'Session Replay and Heatmap'; */
          } else if (cookie.name.includes('customer') || cookie.domain.includes('customer')) {
            category = 'Customer Interaction';
          /*} else if (cookie.name.includes('pref') || cookie.domain.includes('pref')) {
            return 'Preferences'; */
          } else if (cookie.name.includes('loadbal') || cookie.domain.includes('loadbal')){
            return 'Load Balancing';
           /*}else if (cookie.name.includes('ui') || cookie.domain.includes('ui')){
            return 'User Interface'; */
          /*} else if (cookie.name.includes('security') || cookie.domain.includes('security')){
            return 'Security'; */
          /*} else if (cookie.name.includes('compliance') || cookie.domain.includes('compliance')){
            return 'Compliance'; */
          }
          
          if (cookie.name.includes('ui') || cookie.domain.includes('ui') || cookie.name.includes('pref') || cookie.domain.includes('pref')) {
            return 'UI and Preferences';
          }
          
          if (cookie.name.includes('analytic') || cookie.domain.includes('analytic') || cookie.name.includes('replay') || cookie.domain.includes('replay')) {
            return 'Analytics and User Interaction';
          }
          
          if (cookie.name.includes('security') || cookie.domain.includes('security') || cookie.name.includes('compliance') || cookie.domain.includes('compliance')) {
            return 'Security and Compliance';
          }
        
          if (!category) {
            console.log('Uncategorised cookie: ', cookie);
            category = 'Uncategorized';
          }
          return category
          },

    },
    computed: {
        categorisedCookies(){
            const categories = {
            'Advertising': [],
           // 'Analytics': [],
            'Social Media': [],
            'Content Personalization': [],
            'Affiliate Tracking': [],
           // 'Session Replay and Heatmap': [],
            'Customer Interaction': [],
            //'Preferences': [],
            'Load Balancing':[],
            //'User Interface': [],
            //'Secuirty': [],
            //'Compliance':[],
            'Persistent': this.persistentCookies,
            'Session': this.sessionCookies,
            'Secure' : this.secureCookies,
            'UI and Preferences':[],
            'Analytics and User Interaction':[],
            'Secuirty and Compliance':[]
          };
      
          /*
          for (let cookie of this.cookies) {
            let category = this.categorisedCookie(cookie);
            if (category) {
                if (!categories[category]) {
                categories[category] = []; 
              }
              categories[category].push(cookie);
            }
          }
          */
          this.cookies.forEach(cookie => {
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