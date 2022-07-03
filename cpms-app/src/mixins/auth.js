import { mapGetters } from 'vuex';

import { AUTH_GETTERS_TOKEN, AUTH_GETTERS_MENUS } from '@/store';

export default {
  name: 'auth-mixin',
  computed: {
    ...mapGetters({
      token: AUTH_GETTERS_TOKEN,
      menus: AUTH_GETTERS_MENUS,
    }),
  },
};
