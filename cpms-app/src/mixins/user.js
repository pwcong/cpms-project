import { mapGetters } from 'vuex';

import { USER_GETTERS_USER, USER_GETTERS_USERINFO } from '@/store';

export default {
  name: 'user-mixin',
  computed: {
    ...mapGetters({
      user: USER_GETTERS_USER,
      userInfo: USER_GETTERS_USERINFO,
    }),
  },
};
