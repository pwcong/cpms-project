<template>
  <div class="list-layout">
    <slot name="header" class-name="list-layout-header" />
    <slot name="toolbar" class-name="list-layout-toolbar" />
    <slot name="main" class-name="list-layout-main" />
    <slot />
    <slot name="footer" class-name="list-layout-footer" />
  </div>
</template>

<script>
export default {
  name: 'list-layout',
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.list-layout {
  position: relative;
  width: 100%;
  height: 100%;
  &-header,
  &-toolbar,
  &-main,
  &-footer {
    position: absolute;
    width: 100%;
    left: 0;
    box-sizing: border-box;
  }

  &-header,
  &-toolbar {
    z-index: 10;
    box-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
  }

  &-footer {
    bottom: 0;
    box-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
  }

  &-main {
    overflow: auto;
  }
}
</style>
