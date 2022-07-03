<template>
  <div class="project-item">
    <div class="left">
      <div class="desc">
        <span>客户名称: </span>
        <span>{{ tempValue.fdCustName || '--' }}</span>
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
        <span v-if="tempValue.fdProvince || tempValue.fdCity">{{
          `${tempValue.fdProvince}-${tempValue.fdCity}` || '--'
        }}</span>
      </div>
      <div class="desc">
        <span>创建时间: </span>
        <span>{{ formatDateTime(tempValue.createTime) || '--' }}</span>
      </div>
    </div>

    <div class="bottom">
      <div style="text-align: right; margin-top: 10px">
        <van-button size="mini" type="danger" @click="handleBuildRecord(tempValue)"> 查看生成记录 </van-button>
        <van-button size="mini" type="danger" @click="handleDistributeSalesman(tempValue)"> 分配业务员 </van-button>
      </div>
    </div>
    <!-- 分配业务员 -->
    <distribute-salesman
      :sapCustId="sapCustId"
      :version="version"
      :cpmsCustId="cpmsCustId"
      :visible.sync="distributeVisible"
    />
  </div>
</template>

<script>
import DistributeSalesman from './distribute-salesman';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: { DistributeSalesman },
  name: 'without-salesman-item',
  data() {
    return {
      distributeVisible: false,
      sapCustId: '',
      version: '',
      cpmsCustId: '',
    };
  },
  methods: {
    // handleDetail() {
    //   this.$router.push({
    //     path: `/Business/Contract/ContractDetail/${this.tempValue.id}`,
    //   });
    // },
    handleBuildRecord(record) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${record.cpmsCustId}`,
      });
    },
    handleDistributeSalesman(record) {
      this.distributeVisible = true;
      this.sapCustId = record.sapCustId;
      this.cpmsCustId = record.cpmsCustId;
      this.version = record.version;
      // this.$refs.aaa.handleInit();
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
