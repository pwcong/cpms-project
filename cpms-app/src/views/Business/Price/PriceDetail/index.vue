<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="价格详情"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
        :right-text="checkButton(formData, 'priceEdit') ? '编辑' : undefined"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form" @submit="onSubmit()">
          <block theme="primary" title="基本信息">
            <van-field readonly name="fdProjectMainName" v-model="formData.fdProjectMainName" label="项目名称" />
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field
              readonly
              name="fdContractDeliveryTime"
              v-model="formData.fdContractDeliveryTime"
              label="合同交货时间"
            />
            <van-field readonly name="fdBeginTime" v-model="formData.fdBeginTime" label="开始时间" />
            <van-field readonly name="fdOrderEndTime" v-model="formData.fdOrderEndTime" label="开单截止时间" />
            <van-field readonly name="fdBranchCompanyName" v-model="formData.fdBranchCompanyName" label="分公司">
            </van-field>
            <van-field readonly name="fdSaleDeptName" v-model="formData.fdSaleDeptName" label="销售部"> </van-field>
            <van-field readonly name="fdCustName" v-model="formData.fdCustName" label="客户名称" />
            <van-field readonly name="fdSapCustName" v-model="formData.fdSapCustName" label="SAP客户名称" />
            <van-field readonly name="fdChannelOneName" v-model="formData.fdChannelOneName" label="一级渠道" />
            <van-field readonly name="fdChannelTwoName" v-model="formData.fdChannelTwoName" label="二级渠道" />
            <van-field readonly name="fdUserName" v-model="formData.fdUserName" label="联系人" />
            <van-field readonly name="fdUserMobile" v-model="formData.fdUserMobile" label="联系电话" />
            <van-field readonly name="fdCity" v-model="formData.fdCity" label="项目所在城市" />
            <van-field readonly name="fdIsRegion" :value="formData.fdIsRegion > 0 ? '是' : '否'" label="项目是否跨区" />
            <van-field
              readonly
              name="fdEstimatedRevenue"
              v-model="formData.fdEstimatedRevenue"
              label="项目预计收入(元)"
            />
            <!-- <van-field
              readonly
              name="fdCorporateName"
              v-model="formData.fdCorporateName"
              label="分公司"
            >
            </van-field> -->
            <van-field
              readonly
              name="fdApplyReason"
              v-model="formData.fdApplyReason"
              show-word-limit
              rows="4"
              type="textarea"
              maxlength="500"
              label="授权理由概述"
            />
            <van-field
              readonly
              name="files"
              :value="formData.sysAttContractAspectParams.map((d) => d.text).join(',')"
              label="价格附件"
            >
            </van-field>
          </block>

          <van-tabs>
            <van-tab title="价格信息">
              <price-list v-model="formData" readonly></price-list>
            </van-tab>
            <van-tab title="更多信息">
              <more-info readonly :value="formData" />
            </van-tab>
            <van-tab title="审批记录">
              <audit-record moduleFlag="cpms_project_price_main" :moduleId="id" readonly></audit-record>
            </van-tab>
            <van-tab title="审批信息">
              <audit-info readonly :moduleId="id" moduleFlag="cpms_project_price_main"></audit-info>
            </van-tab>
            <van-tab title="推送记录">
              <push-record readonly :moduleId="id" moduleFlag="cpms_project_price_main"></push-record>
            </van-tab>
          </van-tabs>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import PushRecord from '../components/push-record';
import { formatMixin } from '@/mixins';
import formMixin from '../PriceEdit/form';
import { userMixin } from '@/mixins';
import PriceList from '../PriceEdit/price-list';
import MoreInfo from '@/views/components/more-info';
import SelectionCorprate from '@/views/components/selection/corporate';
import { commonMixin } from '@/views/mixins';

export default {
  name: 'PriceDetail',
  mixins: [userMixin, formatMixin, formMixin, commonMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  created() {
    this.initFormData(this.id);
  },
  components: {
    PriceList,
    AuditRecord,
    AuditInfo,
    MoreInfo,
    PushRecord,
    SelectionCorprate,
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
