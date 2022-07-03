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

<style lang="scss" scoped></style>
