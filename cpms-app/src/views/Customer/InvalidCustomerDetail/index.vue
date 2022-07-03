<template>
  <list-layout class="page-customer-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="客户详情" left-text="返回" left-arrow @click-left="handleCancel(false)" />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <div class="customer-bar">
          <div class="left">
            <img :src="svgEmpty" />
          </div>
          <div class="right">
            <div class="customer-title">
              {{ formData.fdCustName ? formData.fdCustName : '--' }}
            </div>
            <div class="customer-tags">
              <van-button size="mini" v-if="formData.fdCustIndustry" plain type="danger">
                <template>
                  <dict-text
                    :value="(formData.fdCustIndustry || '').split(',')"
                    dictCode="cpms_business"
                    systemCode="cpms"
                  />
                </template>
              </van-button>
              <van-button v-if="formData.fdCustType" size="mini" plain type="danger">
                <template>
                  <dict-text
                    :value="(formData.fdCustType || '').split(',')"
                    dictCode="cpms_cust_type"
                    systemCode="cpms"
                  />
                </template>
              </van-button>
              <van-button v-if="formData.fdCustManageforms" size="mini" plain type="danger">
                {{ formData.fdCustManageforms }}
              </van-button>
            </div>
          </div>
        </div>
        <div>
          <!-- <action-info /> -->
          <van-tabs>
            <van-tab title="客户详情">
              <customer-detail :value="formData" />
            </van-tab>
            <van-tab title="更多信息">
              <more-info readonly :value="formData" />
            </van-tab>
            <van-tab title="审批信息">
              <audit-info readonly :moduleId="id" moduleFlag="cpms_cust_main"></audit-info>
            </van-tab>

            <van-tab title="客户联系人">
              <contact-list readonly v-model="formData" />
            </van-tab>
            <van-tab title="办公地址">
              <address-list readonly v-model="formData" />
            </van-tab>
            <van-tab title="项目信息">
              <project-info readonly :moduleId="id" />
              <!-- <project-follow /> -->
            </van-tab>
            <van-tab title="跟进记录">
              <follow-record readonly :moduleId="id" moduleFlag="cpms_cust_main" />
            </van-tab>
            <van-tab title="操作记录">
              <modify-record readonly :moduleId="id" moduleFlag="cpms_cust_main" />
            </van-tab>
            <van-tab title="审批记录">
              <audit-record readonly :moduleId="id" moduleFlag="cpms_cust_main" />
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </template>
  </list-layout>
</template>
<script>
import formMixin from '../InterdCustomerEdit/form';
import ActionInfo from '../InterdCustomerDetail/action-info';
import CustomerDetail from '../InterdCustomerDetail/customer-detail';
import MoreInfo from '@/views/components/more-info';
import ProjectInfo from '../InterdCustomerDetail/project-info';
import ContactList from '../InterdCustomerEdit/contact-list';
import AddressList from '../InterdCustomerEdit/address-list';
import ModifyRecord from '@/views/components/modify-record';
import AuditInfo from '@/views/components/audit-info';
import FollowRecord from '@/views/components/follow-record';
import ProjectFollow from '../InterdCustomerDetail/project-follow';
import AuditRecord from '@/views/components/audit-record';
import { commonMixin } from '@/views/mixins';

import svgEmpty from '@/assets/images/empty.svg';

export default {
  mixins: [formMixin, commonMixin],
  components: {
    ActionInfo,
    CustomerDetail,
    MoreInfo,
    AuditInfo,
    ProjectInfo,
    ContactList,
    AddressList,
    ModifyRecord,
    FollowRecord,
    ProjectFollow,
    AuditRecord,
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
}
</style>
