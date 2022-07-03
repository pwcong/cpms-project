<template>
  <div class="page-sso"></div>
</template>

<script>
import { auth } from 'poros/utils';
import { USER_ACTIONS_FETCH_USER } from '@/store';

export default {
  name: 'page-sso',
  created() {
    // 单点登录
    this.ssoLogin();
  },
  methods: {
    async ssoLogin() {
      const loading = this.$toast.loading({
        message: '自动登录中',
        forbidClick: true,
        duration: 0,
      });

      await this.$store.dispatch(USER_ACTIONS_FETCH_USER, false);

      try {
        switch (this.$config.buildTarget) {
          case 'cordova':
            const user = await this.$nativeApi.getUser();
            console.log(user);
            await this.$store.dispatch(USER_ACTIONS_FETCH_USER, {
              accessToken: user.token,
              tokenType: 'TCHAT',
            });
            break;
          default:
            const token = auth.getToken();
            console.log(token);
            await this.$store.dispatch(USER_ACTIONS_FETCH_USER, {
              accessToken: token,
              tokenType: 'LOGIN',
            });
            break;
        }

        this.$router.replace(decodeURIComponent(this.$route.query.returnUrl || '/'));
      } catch (error) {
        this.$toast.fail({
          message: error.noValid ? error.message : '自动登录失败',
          forbidClick: true,
          duration: 1000,
        });
        this.$router.replace('/login');
      } finally {
        loading.clear();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-sso {
  .error {
    color: #999999;
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 60px;
    }
  }
}
</style>
