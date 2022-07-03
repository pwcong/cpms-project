<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive :include="cacheList">
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { routes } from './router';
import { DIRECTION_GETTERS_DIRECTION } from './store';

function getCacheList(routes, cacheList) {
  cacheList = cacheList || new Set();

  routes.forEach((r) => {
    if ((r.meta || {}).keepAlive) {
      cacheList.add(r.name);
    }

    if (Array.isArray(r.children)) {
      getCacheList(r.children, cacheList);
    }
  });

  return Array.from(cacheList.values());
}

export default {
  name: 'app',
  data() {
    return {
      cacheList: getCacheList(routes),
    };
  },
  created() {
    // 全局后退方法
    this.$root.goBack = this.goBack;

    this.initApp();

    // 监听返回键
    document.addEventListener('backbutton', () => this.goBack(), false);
  },
  methods: {
    initApp() {
      // 底座环境下
      if (this.$config.env !== 'local') {
        // 隐藏悬浮
        this.$nativeApi.hideFloat();
        // 隐藏导航
        this.$nativeApi.hideNav();
        // 状态栏变色
        this.$nativeApi.changeColor(this.$config.themeColor);
        this.$nativeApi.changeColorAndroid(this.$config.themeColor);
        // 禁用webview橡皮筋效果
        this.$nativeApi.setBounces('0');
      }
    },
    goBack() {
      if (this.$route.path === '/' || this.$route.path === '/login') {
        if (this.$config.env !== 'local') {
          this.$nativeApi.exit();
        }
      } else {
        this.$router.back();
      }
    },
  },
  computed: {
    ...mapGetters({
      direction: DIRECTION_GETTERS_DIRECTION,
    }),
    transitionName() {
      return 'pop-' + (this.direction === 'reverse' ? 'out' : 'in');
    },
  },
};
</script>

<style lang="scss">
html,
body,
#app {
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;
  height: 100%;
  width: 100%;
  color: #333333;
  background-color: #f4f4f4;
}

* {
  -webkit-overflow-scrolling: touch;
}

.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}

.pop-static-enter-active,
.pop-static-leave-active {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}

.pop-static-enter-active {
  animation-name: popInStatic;
}

.pop-static-leave-active {
  animation-name: popInStatic;
}

.pop-out-enter-active {
  animation-name: popInLeft;
}

.pop-out-leave-active {
  animation-name: popOutRight;
}

.pop-in-enter-active {
  animation-name: popInRight;
}

.pop-in-leave-active {
  animation-name: popOutLeft;
}

@keyframes popInStatic {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>

<style lang="scss" scoped>
.router-view {
  width: 100%;
  height: 100%;
  position: absolute !important;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  backface-visibility: hidden;
  overflow: auto;
}
</style>
