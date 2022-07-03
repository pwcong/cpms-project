<template>
  <p-layout class="home">
    <home-header />

    <div class="home-content-wrap">
      <p-sider-menu class="home-sider" />

      <p-layout-content class="home-content">
        <p-router-tabs class="home-main" scroll />
      </p-layout-content>
    </div>
  </p-layout>
</template>

<script>
import HomeHeader from './components/home-header';

export default {
  name: 'Home',
  components: {
    HomeHeader,
  },
  methods: {
    // 接收 iframe 的消息
    handleIframeNotify() {
      window.addEventListener('message', (event) => {
        try {
          if (event.data.type === 'updateUserInfo') {
            this.$store.dispatch('requireUserInfo');
          }
        } catch (err) {}
      });
    },
  },
  created() {
    this.handleIframeNotify();

    // 系统列表
    this.$store.dispatch('requestSysUid');
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  min-width: 1280px;

  .home-sider {
    box-shadow: -2px 0 12px rgba(100, 101, 102, 0.2);
    z-index: 1;
  }

  .home-content {
    .poros-tabs-nav-container {
      font-size: 13px !important;
    }
  }

  .home-main {
  }

  /deep/ .home-main {
    & > .poros-tabs {
      box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2);

      & > .poros-tabs-bar {
        border-bottom: none;

        .poros-tabs-tab-prev,
        .poros-tabs-tab-next {
          border: none;
        }
        .poros-tabs-tab-active {
          color: #e50113;
        }
        .poros-tabs-close-x {
          margin-top: 2px;
        }
      }
    }

    & > .poros-router-tabs__main {
      border: none;
      box-shadow: 2px 2px 12px rgba(100, 101, 102, 0.2);
    }
  }

  .poros-layout-sider {
    border-right: none;
    background-image: url('~@/assets/images/sider-bg.png');
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }

  &-content-wrap {
    flex: 1;
    height: 0; // 防止溢出
    display: flex;

    .home-content {
      min-width: 0;
      .poros-tabs-nav-container {
        font-size: 13px !important;
      }
    }
  }
}
</style>
