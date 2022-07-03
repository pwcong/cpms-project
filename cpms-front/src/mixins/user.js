export default {
  computed: {
    user() {
      return this.$store.state.user || {};
    },
    userInfo() {
      return this.user.userInfo || {};
    },
  },
};
