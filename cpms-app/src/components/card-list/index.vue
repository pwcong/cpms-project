<template>
  <div class="card-list">
    <div class="card" v-for="(item, index) in data" :key="index">
      <div class="card-wrapper">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  name: 'card-list',
};
</script>

<style lang="scss" scoped>
.card-list {
  .card {
    padding: 0 12px;
    padding-top: 10px;
  }

  .card-wrapper {
    border-radius: 4px;
    overflow: hidden;
  }
  /deep/.van-cell-group {
    &:active {
      .van-cell {
        background-color: #f5f5f5;

        &__title {
          width: 30%;
        }
      }
    }
    .van-cell {
      &__title {
        max-width: 30%;
      }
    }
  }
}
</style>
