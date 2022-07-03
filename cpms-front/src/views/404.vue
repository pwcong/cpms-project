<template>
  <div class="page-miss">
    <img class="miss-number" src="@/assets/images/404.png" />
    <p-button class="go-back" type="primary" @click="goBack">
    返回上一页</p-button>
  </div>
</template>
<script>
export default {
  name: '404',
  methods: {
    goBack(){
      this.$router && this.$router.back(true);
    }
  }
}
</script>
<style lang="less" scoped>
.page-miss{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background: url("~@/assets/images/404_bg.png");
  background-position: center center;
  background-size: cover;
  .go-back{
    position: absolute;
    bottom: 10%;
    left: calc((100% - 102px) / 2);
  }
  .page-miss-bg{
    height: 100%;
  }
  .miss-number{
    position: absolute;
    width: 31%;
    top: 23%;
    left: 34%;
  }
}
</style>
