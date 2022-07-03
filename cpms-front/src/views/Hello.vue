<template>
  <div class="hello">
    <div class="hello-content">
      <img src="@/assets/images/home.png" />
      <h1>{{ welcomeText }}{{ systemName }}</h1>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const WELCOME_TEXT = {
    zh_CN: '欢迎使用',
    en_US: 'Welcome to '
  }

  export default {
    name: 'Hello',
    computed: {
      ...mapGetters(['language', 'systemName']),

      welcomeText () {
        return WELCOME_TEXT[this.language]
      }
    }
  }
</script>

<style lang="less" scoped>
  .hello {
    height: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-content {
      position: relative;
      top: -40px;
      height: 545px;

      h1 {
        position: absolute;
        left: 0;
        right: 20px;
        bottom: 20px;
        white-space: nowrap;
        text-align: center;
        font-size: 24px;
      }

      img {
        height: 100%;
      }
    }

    @media screen and (max-height: 900px) {
      &-content {
        top: -20px;
      }
    }
    @media screen and (max-height: 768px) {
      &-content {
        top: 0;
        height: 500px;

        h1 {
          bottom: 40px;
          font-size: 20px;
        }
      }
    }
  }
</style>