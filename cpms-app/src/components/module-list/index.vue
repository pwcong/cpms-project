<template>
  <div :class="['module-list', `module-list--${theme}`]">
    <div class="module-list-wrapper" v-if="tempValue.length > 0">
      <template v-for="(item, index) in tempValue">
        <div class="module" :key="index" v-if="(item.children || []).length > 0">
          <div class="module-head">{{ item.title }}</div>
          <div class="module-items">
            <div class="module-items-wrapper">
              <div
                class="module-item"
                v-for="(_item, _index) in item.children"
                :key="_index"
                @click="handleGoTo(_item)"
              >
                <div class="module-icon">
                  <img :src="_item.icon" />
                </div>
                <div class="module-title">
                  {{ _item.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <van-empty image-size="100px" v-else description="暂无菜单项，请联系管理员添加" />

    <van-popup
      :get-container="selectionContainer"
      :value="subVisible"
      position="right"
      @click-overlay="subVisible = false"
      :style="{ width: '75%', height: '100vh' }"
    >
      <module-list theme="sub" :value="subModules" @goto="handleGoTo" />
    </van-popup>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'module-list',
  mixins: [selectionMixin],
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    // value: {
    //   type: Array,
    //   default: () => [
    //     {
    //       title: 'XXX',
    //       path: '/XXX',
    //       children: [
    //         {
    //           icon: YYY,
    //           path: '/XXX/YYY',
    //           title: 'YYY',
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
  data() {
    return {
      subModules: [],
      subVisible: false,
    };
  },
  methods: {
    handleGoTo(item) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        this.subVisible = true;
        this.subModules = [item];
      } else {
        this.subVisible = false;
        this.$emit('goto', item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.module-list {
  .module {
    background-color: white;
    &:not(:last-child) {
      border-bottom: 1px solid #dddddd;
    }
  }

  .module-head {
    user-select: none;
    background-color: #f8f8f8;
    padding-left: 20px;
    font-size: 14px;
    line-height: 40px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 14px;
      background-color: $theme-color;
    }
  }

  .module-items {
    &-wrapper {
      font-size: 0;
      padding: 10px;
    }
    .module-item {
      user-select: none;
      text-align: center;
      width: 25%;
      display: inline-block;
      font-size: 12px;
      padding: 10px 0 10px;
      transition: all 0.2s;
      &:active {
        background-color: #eeeeee;
      }
    }

    .module-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .module-icon {
      img {
        width: 30px;
        height: 30px;
      }
    }
  }

  &--sub {
    .module-head {
      text-align: center;
      background-color: $theme-color;
      color: white;
      &::before {
        display: none;
      }
    }
    .module-item {
      width: calc(100% / 3) !important;
    }
  }
}
</style>
