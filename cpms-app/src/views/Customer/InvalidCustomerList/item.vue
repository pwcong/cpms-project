<template>
  <div class="customer-item" @click="handleDetail(tempValue.id, 'invalid')">
    <div class="left">
      <div class="title">
        {{ tempValue.fdCustName ? tempValue.fdCustName : '--' }}
      </div>
      <div class="info">
        <span> 创建时间: </span>
        <span>
          {{ formatDateTime(tempValue.createTime) }}
        </span>
      </div>
      <div class="info" v-if="tempValue.fdCustIndustry">
        <span>所属行业: </span>
        <span>
          <dict-text :value="(tempValue.fdCustIndustry || '').split(',')" dictCode="cpms_business" systemCode="cpms" />
        </span>
      </div>

      <div class="info" v-if="tempValue.fdCustType">
        <span>客户类型: </span>
        <span>
          <dict-text :value="(tempValue.fdCustType || '').split(',')" dictCode="cpms_cust_type" systemCode="cpms" />
        </span>
      </div>
      <div class="info">
        <span>客户编码: </span>
        <span>{{ tempValue.fdNumber }}</span>
      </div>
    </div>

    <div class="bottom">
      <van-button size="small" type="danger" native-type="button" @click.stop="handleClaim()"> 认领 </van-button>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { commonMixin } from '@/views/mixins';
import formMixin from '../InterdCustomerEdit/form';
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'invalid-customer',
  mixins: [selectionMixin, formatMixin, commonMixin, formMixin],
  methods: {
    handleClaim() {
      this.$dialog
        .confirm({
          title: '是否认领当前客户?',
        })
        .then(async () => {
          this.loading = true;

          try {
            const claimCust = {
              id: this.tempValue.id,
              version: this.tempValue.version,
            };
            await api.customer.postClaimCustomer(claimCust);
            this.onOk();
          } catch (e) {
            console.error(e);
          } finally {
            this.$emit('change');
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.customer-item {
  background: #ffffff;
  padding: 10px;
  position: relative;

  &:active {
    background-color: #f5f5f5;
  }

  .left {
    .title {
      font-size: 14px;
      padding-right: 80px;
    }

    .info {
      font-size: 12px;
      color: #666666;
      margin-top: 6px;
    }
  }

  .bottom {
    margin-top: 10px;
    text-align: right;
  }

  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
