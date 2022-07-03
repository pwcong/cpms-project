<template>
  <div :class="['data-grid', `data-grid--${theme}`]">
    <div class="data-grid-wrapper">
      <div class="data-grid-item" v-for="(item, index) in tempValue" :key="item.key">
        <div class="data-grid-item-value">
          <slot :name="item.key" :item="item" :index="index">
            <span :style="getStyle(item).value">
              {{ item.value }}
            </span>
          </slot>
        </div>
        <div class="data-grid-item-title">
          <slot name="title" :item="item" :index="index">
            <span :style="getStyle(item).title">
              {{ item.title }}
            </span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [
    // {
    //   key: 'xxx',
    //   title: 'xxx',
    //   value: 'xxx',
    // },
  ],
});

export default {
  name: 'data-grid',
  mixins: [selectionMixin],
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    getStyle: {
      type: Function,
      default: (item) => ({
        title: '',
        value: '',
      }),
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.data-grid {
  background-color: white;
  overflow-y: auto;
  font-size: 14px;
  & > &-wrapper {
    display: flex;
    align-items: center;
    // justify-content: space-around;
  }

  &--default &-item {
    white-space: nowrap;
    height: 50px;
    display: flex;
    flex: 1;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    & > div:nth-child(1) {
      font-size: 14px;
      color: $theme-color;
      margin-bottom: 2px;
    }
  }

  &--report &-item {
    flex: 1;
    padding: 0 4px;
    height: 50px;
    white-space: nowrap;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    & > div:nth-child(1) {
      order: 2;
      margin-top: 2px;
      font-size: 14px;
    }
    & > div:nth-child(2) {
      font-size: 14px;
      order: 1;
      color: #666666;
    }
  }
}
</style>
