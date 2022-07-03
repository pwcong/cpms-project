<template>
  <div :class="['block', `block--${theme}`]">
    <div class="block-t" v-if="hasTop">
      <div class="block-t-l">
        <div v-if="hasTitle" class="block-title">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
      </div>
      <div class="block-t-r"><slot name="action" /></div>
    </div>
    <div class="block-b">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'block',
  props: {
    title: {
      type: String,
    },
    theme: {
      type: String,
      default: 'default',
    },
  },
  computed: {
    hasTitle() {
      const { title } = this.$slots;
      return !!this.title || !!title;
    },
    hasTop() {
      const { action } = this.$slots;
      return !!this.hasTitle || !!action;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

$cls: block;

.#{$cls} {
  width: 100%;
  background-color: white;
  font-size: 14px;
  &-t {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    min-height: 40px;

    &-l {
      flex: 1;
    }

    &-l,
    &-r {
      display: flex;
      align-items: center;
    }
  }

  &-title {
    position: relative;
    color: #333333;
  }

  &--primary > &-t,
  &--card > &-t {
    align-items: center;
    padding: 0 12px;
  }

  &--primary > &-t > &-t-l > &-title,
  &--card > &-t > &-t-l > &-title {
    padding-left: 8px;
    font-weight: bold;
    &::after {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      content: '';
      width: 3px;
      height: 14px;
      background-color: $theme-color;
    }
  }

  &--primary {
    .block-t {
      background: #f4f4f4;
    }
  }

  &--card {
    padding: 14px;
    border: 1px solid rgba(100, 101, 102, 0.12);
    border-radius: 3px;
    box-shadow: 0 0 12px rgba(100, 101, 102, 0.12);
  }
}
</style>
