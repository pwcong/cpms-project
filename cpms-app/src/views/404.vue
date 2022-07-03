<template>
  <list-layout class="_404">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="页面未找到" left-text="返回" left-arrow @click-left="onClickLeft" />
    </template>

    <template v-slot:main="{ className }">
      <div style="top: 148px; height: calc(100vh - 46px)" :class="className">
        <van-empty image-size="100px" description="当前页面未找到，请联系管理员" />
      </div>
    </template>
  </list-layout>
</template>

<script>
export default {
  methods: {
    onClickLeft() {
      this.$root.goBack();
    },
  },
};
</script>
