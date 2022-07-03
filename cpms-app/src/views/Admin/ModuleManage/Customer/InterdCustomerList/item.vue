<template>
  <div class="customer-item" @click="handleDetail">
    <div class="left">
      <div class="title">
        {{ tempValue.fdCustName ? tempValue.fdCustName : '--' }}
      </div>
      <div class="info">
        <span>客户联系人: </span>
        <span>
          {{
            (tempValue.contactDtoList[0] || {}).fdContactName ? (tempValue.contactDtoList[0] || {}).fdContactName : '--'
          }}
        </span>
      </div>
      <div class="info">
        <span>客户联系电话: </span>
        <span>
          {{
            (tempValue.contactDtoList[0] || {}).fdContactMobile
              ? (tempValue.contactDtoList[0] || {}).fdContactMobile
              : '--'
          }}
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
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | foramtStatus }}
      </status-tag>
    </div>

    <div class="bottom">
      <van-button size="mini" type="danger" @click="handleDistributeSalesman(tempValue)"> 分配业务员 </van-button>
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
import api from '@/api';
import { buildSelectionMixin, formatMixin, userMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';
import DistributeSalesman from '../SAPCustomerSyncWithoutSalesmanList/distribute-salesman';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'customer-item',
  mixins: [selectionMixin, formatMixin, commonMixin, userMixin],
  components: {
    StatusTag,
    DistributeSalesman,
  },
  data() {
    return {
      invalidReasons: {
        id: '',
        version: '',
      },
      sapCustId: '',
      version: '',
      cpmsCustId: '',
      showAction: false,
      distributeVisible: false,
    };
  },

  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        default:
          return v;
      }
    },
  },
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${this.tempValue.id}`,
      });
    },
    call() {
      if (this.tempValue.contactDtoList.length <= 0) {
        // 暂无客户联系人
        this.$toast.fail('暂无客户联系人');
      } else {
        this.$nativeApi.financeCall(this.tempValue.contactDtoList[0].fdContactMobile);
      }
    },
    handleRefresh() {
      this.$emit('change');
    },

    handleDistributeSalesman(record) {
      this.distributeVisible = true;
      this.sapCustId = record.sapCustId;
      this.cpmsCustId = record.id;
      this.version = record.version;
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
