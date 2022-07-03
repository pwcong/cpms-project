<template>
  <div class="project-item" @click="handleDetail">
    <div class="left">
      <div class="desc">
        <span>客户名称: </span>
        <span>{{ tempValue.fdSapCustName || '--' }}</span>
      </div>
      <div class="desc">
        <span>客户编码: </span>
        <span>{{ tempValue.customerId || '--' }}</span>
      </div>
      <div class="desc">
        <span>社会统一信用编码: </span>
        <span>{{ tempValue.fdUnifiedCode || '--' }}</span>
      </div>
      <div class="desc">
        <span>业务员: </span>
        <span>{{ tempValue.fdUserName || '--' }}</span>
      </div>
      <div class="desc">
        <span>省市信息: </span>
        <span>{{ tempValue.fdProvince || '--' }}</span>
      </div>
      <div class="desc">
        <span>创建时间: </span>
        <span>{{ tempValue.createTime || '--' }}</span>
      </div>
    </div>

    <div class="bottom">
      <div style="text-align: right; margin-top: 10px">
        <van-button size="mini" type="danger"> 查看生成记录 </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {},
  name: 'list-item',
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${this.tempValue.cpmsCustId}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .left {
    .title {
      font-size: 14px;
      color: #333333;
      margin-right: 70px;
    }

    .desc {
      margin-top: 6px;
      margin-right: 70px;
    }
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
