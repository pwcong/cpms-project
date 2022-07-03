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

<style lang="scss">
@import '@/assets/scss/common.scss';
$cls: block;

.#{$cls} {
  &-t {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    &-l {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      position: relative;
    }

    &-r {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      position: relative;
    }
  }

  &-b {
    position: relative;
  }

  &-title {
    color: #333333;
    display: inline-block;
    font-size: 16px;
    position: relative;
  }

  &--primary,
  &--card {
    & > .#{$cls}-t .#{$cls}-title {
      padding-left: 12px;
      &::after {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 3px;
        height: 18px;
        background-color: $theme-color;
      }
    }
  }

  &--primary {
    & > .#{$cls}-b {
      padding-left: 16px;
    }
  }

  &--card {
    padding: 16px;
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgb(0 0 0 / 9%);
      border-color: rgb(0 0 0 / 9%);
    }
  }
}
</style>
