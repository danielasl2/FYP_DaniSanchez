export const cookieMixin = {
  methods: {
    categorisedCookie(cookie) {
      if (!('expirationDate' in cookie) || cookie.session) {
        return 'Session Cookies';
      }
      return 'Other Cookies';
    },
  },
  computed: {
    categorisedCookies() {
      const categories = {
        'Session Cookies': [],
        'Other Cookies': [],
      };
      this.filteredCookies.forEach(cookie => {
        const category = this.categorisedCookie(cookie);
        categories[category].push(cookie);
      });
      return categories;
    },
  },
};
