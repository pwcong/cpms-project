<template>
  <list-layout class="page-customer-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="客户详情"
        left-text="返回"
        left-arrow
        :right-text="checkButton(formData, 'edit') ? '编辑' : undefined"
        @click-left="handleCancel(false)"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <div class="customer-bar">
          <div class="left">
            <img :src="svgEmpty" />
          </div>
          <div class="right">
            <div class="customer-title">
              {{ formData.fdSapCustName ? formData.fdSapCustName : '--' }}
            </div>
            <div class="essential-information">申请人：{{ formData.fdReqUser }}</div>
            <div class="essential-information">申请人部门：{{ formData.fdReqDept }}</div>
            <div class="essential-information">
              维护类型：
              <template>
                <dict-text
                  :value="(formData.fdMaintainType || '').split(',')"
                  dictCode="cpms_sap_maintain_type"
                  systemCode="cpms"
                />
              </template>
            </div>
            <div class="essential-information">创建日期：{{ formData.fdCreateTime }}</div>
          </div>
        </div>
        <div>
          <van-tabs>
            <van-tab title="客户详情">
              <customer-detail :value="formData" />
            </van-tab>
            <van-tab title="更多信息">
              <van-field :value="formData.fdBillnumber" readonly label="财务共享单据号" name="fdBillnumber" />
            </van-tab>
            <van-tab title="公司代码视图"><company-list readonly v-model="formData" /> </van-tab>
            <van-tab title="销售视图"><sales-list readonly v-model="formData" /> </van-tab>
            <van-tab title="银行账户信息"><bank-list readonly v-model="formData" /></van-tab>
            <van-tab title="关联客户信息"
              ><cust-list readonly v-model="formData" :moduleId="formData.fdCustMainId"
            /></van-tab>
            <van-tab title="推送记录">
              <push-record readonly :moduleId="id"></push-record>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </template>
  </list-layout>
</template>
<script>
import formMixin from '../SAPCustomerEdit/form';
import CustomerDetail from './customer-detail';
import MoreInfo from '@/views/components/more-info';
import CompanyList from '../SAPCustomerEdit/company-list';
import SalesList from '../SAPCustomerEdit/sales-list';
import BankList from '../SAPCustomerEdit/bank-list';
import CustList from './cust-list';
import { commonMixin } from '@/views/mixins';
import svgEmpty from '@/assets/images/empty.svg';
import PushRecord from '../components/push-record';

export default {
  mixins: [formMixin, commonMixin],
  components: {
    CustomerDetail,
    MoreInfo,
    CompanyList,
    SalesList,
    BankList,
    CustList,
    PushRecord,
  },
  data() {
    const { id } = this.$route.params;
    const { type } = this.$route.query;
    return {
      id,
      type,
      svgEmpty,
      itemVisible: false,
      itemValue: {},
    };
  },
  created() {
    this.initFormData(this.id);
  },
};
</script>
<style lang="scss" scoped>
.page-customer-detail {
  .customer-bar {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #eeeeee;
    display: flex;

    .left {
      background-color: #f5f5f5;
      margin-right: 14px;
      padding: 8px;
      border-radius: 4px;
      img {
        width: 70px;
        height: 70px;
      }
    }

    .right {
      flex: 1;
    }
  }

  .customer-title {
    font-size: 14px;
    margin-bottom: 4px;
  }
  .essential-information {
    font-size: 12px;
    margin-bottom: 2px;
    color: #858383;
  }
}
</style>
