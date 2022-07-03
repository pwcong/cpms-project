<template>
  <div class="card-wrapper" @click="handleDetail">
    <div class="desc clientName">客户/代理商: {{ data.fdCustName }}</div>
    <div class="desc">项目名称: {{ data.fdName }}</div>
    <div class="desc">
      相似度:
      <span class="correlation">
        {{ `${(data.fdSimilarity * 100).toFixed(2)}%` }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'query-item',
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Business/ProjectDetail/${this.data.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.card-wrapper {
  font-size: 12px;
  padding: 10px 0;
  .desc {
    margin: 6px 0;
  }
  .clientName {
    font-size: 14px;
    color: #1740dc;
    margin: 10px 0;
  }
  .correlation {
    font-weight: 700;
    color: $theme-color;
  }
}
</style>
