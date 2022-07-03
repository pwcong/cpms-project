<template>
  <p-layout>
    <p-layout-content>
      <router-view />
    </p-layout-content>
    <p-layout-footer class="copyright">
      Copyright &copy; TCL实业控股股份有限公司.保留所有权
    </p-layout-footer>
  </p-layout>
</template>

<script>
export default {
  name: 'Unauthorized',
};
</script>

<style lang="less" scoped>
.copyright {
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
}
</style>
