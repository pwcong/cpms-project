<template>
  <div
    :class="{
      'amap-item': true,
      checked: checked,
    }"
  >
    <div class="name">{{ value.name }}</div>
    <div class="address">
      {{ value.pname + value.cityname + value.adname + value.address }}
    </div>
    <div v-if="position" class="position">
      <van-icon name="location-o" />
      <span>{{ !!countDistance ? countDistance + '米' : '未知' }}</span>
    </div>
  </div>
</template>

<script>
import { calcDistance } from '@/utils';
export default {
  name: 'amap-item',
  props: {
    checked: Boolean,
    position: Object,
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    countDistance() {
      if (!this.position) {
        return '';
      }
      return calcDistance(this.position, {
        longitude: this.value.location.split(',')[0],
        latitude: this.value.location.split(',')[1],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.amap-item {
  user-select: none;
  cursor: pointer;
  padding: 4px 6px;
  transition: all 0.2s;
  border: 1px solid transparent;
  border-radius: 2px;

  .name {
    font-size: 14px;
  }
  .position,
  .address {
    display: flex;
    align-items: center;
    margin-top: 4px;
    font-size: 12px;
    color: #999999;
  }
  &.checked {
    box-sizing: border-box;
    border: 1px solid $theme-color;
    background-color: rgba($theme-color, 0.05);
  }
}
</style>
