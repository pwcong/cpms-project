<template>
  <list-layout class="page-login">
    <van-form @submit="onFormSubmit" style="position: relative; background-color: white; padding: 20px 10px">
      <div class="login-head">
        <div class="login-logo">
          <img :src="logo" />
        </div>
        <div class="login-title">CPMS</div>
      </div>

      <div class="login-close" @click="onClickLeft">
        <van-icon name="cross" />
      </div>

      <van-field
        required
        v-model="username"
        name="username"
        label="用户名"
        placeholder="请输入"
        :rules="[{ required: true, message: '请输入用户名' }]"
      />
      <van-field
        required
        v-model="password"
        name="password"
        type="password"
        label="密码"
        placeholder="请输入"
        :rules="[{ required: true, message: '请输入密码' }]"
      />
      <div class="login-footer">
        <van-button :loading="loading" block type="danger" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
  </list-layout>
</template>

<script lang="js">
import { api } from 'poros/utils';

import { USER_ACTIONS_FETCH_USER } from '@/store';

import logo from '@/assets/images/logo.svg';

export default {
  name: 'page-login',
  data() {
    return {
      logo,
      loading: false,
      username: '',
      password: '',
    };
  },
  methods: {
    onClickLeft() {
      this.$root.goBack();
    },
    async onFormSubmit() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      try {
        const username = this.username.trim();
        const password = this.password.trim();

        const res = await api.login({
          username,
          password,
        });

        if (res.code !== 0) {
          throw new Error(res.msg);
        }

        const data = res.data || {};

        console.log(data);

        await this.$store.dispatch(USER_ACTIONS_FETCH_USER, {
          accessToken: data.accessToken,
          tokenType: 'LOGIN'
        });

        this.$toast.success({
          message: `登录成功`,
        });

        setTimeout(() => {
          this.$router.replace('/');
        }, 300);
      } catch (e) {
        console.error(e);
        this.$toast.fail({
          message: e.message || `登录失败`,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-login {
  .login-head {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 20px;
    padding-top: 20px;
    position: relative;
  }

  .login-logo {
    // width: 60px;
    margin-right: 14px;
    height: 36px;
    display: flex;
    align-items: center;

    img {
      height: 36px;
      width: 36px;
    }
  }
  .login-close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 14px;
    font-size: 18px;
  }

  .login-footer {
    margin-top: 20px;
  }
}
</style>
