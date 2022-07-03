<template>
  <div :class="['tabs-layout', `tabs-layout--${theme}`]">
    <div class="head">
      <div class="tabs">
        <div
          v-for="(tab, index) in tabs"
          :class="{ tab: true, active: tab.key === activeKey }"
          @click="handleActiveChange(index)"
          :key="tab.key"
        >
          <template v-if="theme === 'swiper'">
            <p-button
              size="small"
              :ghost="tab.key === activeKey"
              :type="tab.key === activeKey ? 'primary' : 'default'"
            >
              {{ tab.title }}
            </p-button>
          </template>
          <template v-else>
            {{ tab.title }}
          </template>
        </div>
      </div>
      <div class="action">
        <slot name="action" />
      </div>
    </div>
    <div class="main">
      <swiper ref="swiper" class="main-wrapper" @slideChange="handleSwiperChange">
        <swiper-slide v-for="tab in tabs" :key="tab.key">
          <slot :name="tab.key" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
const ETheme = {
  primary: 'primary',
  swiper: 'swiper',
};

export default {
  name: 'tabs-layout',
  props: {
    tabs: {
      type: Array,
      default: () => [
        {
          key: 'test',
          title: '测试',
        },
      ],
    },
    defaultActiveKey: {
      type: String,
    },
    theme: {
      type: String,
      default: ETheme.primary,
    },
  },
  data() {
    return {
      inited: false,
      activeKey: this.defaultActiveKey || (this.tabs[0] || {}).key,
    };
  },
  mounted() {
    this.inited = true;
  },
  methods: {
    handleActiveChange(index) {
      this.activeKey = this.tabs[index].key;
      this.$refs.swiper.swiperInstance.slideTo(index);
    },
    handleSwiperChange(swiper) {
      this.activeKey = this.tabs[swiper.activeIndex].key;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.tabs-layout {
  font-size: 14px;
  .head {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;

    .tabs {
      flex: 1;
      display: flex;
    }
  }

  &--primary {
    .head {
      border-bottom: 1px solid #eeeeee;
    }

    .head .tab {
      padding-bottom: 4px;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      &:not(:last-child) {
        margin-right: 14px;
      }
      &.active {
        color: $theme-color;
        border-bottom-color: $theme-color;
      }
    }
  }

  &--swiper {
    .head .tabs {
      justify-content: center;
    }
    .head .tab {
      margin: 0 4px;
    }
  }
}
</style>
