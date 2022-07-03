<template>
  <p-layout class="print">
    <div class="print-wrapper" id="print">
      <router-view />
    </div>
    <div class="print-trigger">
      <p-button v-print="'#print'" type="primary" style="width: 100%; border-radius: 0">
        打印当前页面
      </p-button>
    </div>
  </p-layout>
</template>

<script>
import print from 'vue-print-nb';

export default {
  name: 'Print',
  directives: {
    print,
  },
};
</script>

<style lang="scss" scoped>
.print {
  overflow: auto;
  width: 100vw;
  min-width: 1000px;
  background-color: white;
  padding: 18px;
  padding-bottom: 64px;
  &-trigger {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
