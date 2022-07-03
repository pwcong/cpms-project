<template>
  <div class="page-login">
    <div class="content">
      <div class="login">
        <div class="login__header">
          <img class="login__logo" src="@/assets/images/logo.svg" />
          <span class="title">CPMS</span>
        </div>
        <p-form-model
          class="login__form"
          ref="form"
          :model="form"
          :rules="rules"
          @keyup.enter.native="submit"
        >
          <p-form-model-item v-if="errMsg">
            <p-alert type="error" showIcon :message="errMsg" />
          </p-form-model-item>
          <p-form-model-item prop="username">
            <p-input
              v-model="form.username"
              size="large"
              placeholder="请输入用户名"
            >
              <p-icon slot="prefix" type="user" />
            </p-input>
          </p-form-model-item>
          <p-form-model-item prop="password">
            <p-input
              v-model="form.password"
              :type="pwdInvisible ? 'password' : 'text'"
              size="large"
              placeholder="请输入密码"
            >
              <p-icon slot="prefix" type="lock" />
              <p-icon
                slot="suffix"
                :type="pwdInvisible ? 'eye-invisible' : 'eye'"
                @click="pwdInvisible = !pwdInvisible"
              />
            </p-input>
          </p-form-model-item>
          <p-form-model-item>
            <p-button
              type="danger"
              size="large"
              style="width: 100%;"
              :loading="loading"
              @click="submit"
              >登录</p-button
            >
          </p-form-model-item>
        </p-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFix } from "@/utils";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      pwdInvisible: true,
      rules: {
        username: [
          { required: true, whitespace: true, message: "请输入用户名" },
        ],
        password: [{ required: true, whitespace: true, message: "请输入密码" }],
      },
      loading: false,
      errMsg: "",
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.loading = true;
        try {
          const res = await this.$store.dispatch("login", this.form);
          if (res.code === 0) {
            this.loginSuccess();
          } else {
            this.loginError(res.msg);
          }
        } finally {
          this.loading = false;
        }
      });
    },
    loginError(errMsg) {
      this.errMsg = errMsg || this.errMsg;
    },
    loginSuccess() {
      this.$notification.success({
        message: "欢迎",
        description: `${timeFix()}，欢迎回来`,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page-login {
  position: relative;
  height: 100%;
  width: 100%;
  .content {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 550px;
    transform: translateY(-50%);
    background-image: url("~@/assets/images/login_bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .login {
    position: absolute;
    right: 128px;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    padding: 24px;
    border-radius: 3px;
  }

  .login__header {
    height: 124px;
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 32px;
    }
  }
  .login__logo {
    height: 36px;
    width: 36px;
    margin-right: 16px;
  }
  .login__form {
    width: 368px;
    margin: 0 auto;
  }
}
</style>
