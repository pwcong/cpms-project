<template>
  <list-layout class="page-project-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="项目详情"
        left-text="返回"
        left-arrow
        :right-text="checkButton(formData, 'edit') ? '编辑' : undefined"
        @click-left="handleCancel(false)"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form>
          <block theme="primary" title="项目关闭状态" v-if="['done', 'lost'].indexOf(formData.fdProjectStatus) > -1">
            <van-field v-model="formData.fdProjectStatus" name="fdProjectStatus" readonly label="关闭类型">
              <template #input>
                <close-type-text :value="(formData.fdProjectStatus || '').split(',')" />
              </template>
            </van-field>
            <van-field
              v-model="formData.fdCloseExplain"
              name="fdCloseExplain"
              readonly
              label="关闭原因"
              type="textarea"
            />
          </block>

          <block theme="primary" title="项目信息">
            <van-field v-model="formData.fdName" name="fdName" readonly label="项目名称" type="textarea" />
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field v-model="formData.fdProjectTypeName" name="fdProjectTypeName" readonly label="项目类型" />
            <van-field v-model="formData.fdTenderNum" name="fdTenderNum" readonly label="项目招投标编号" />
            <van-field v-model="formData.fdBusinessCode" name="fdBusinessCode" readonly label="所属行业">
              <template #input>
                <dict-text
                  :value="(formData.fdBusinessCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdCorporateName" name="fdCorporateName" readonly label="分公司" />
            <van-field v-model="formData.fdAgencyName" name="fdAgencyName" readonly label="业务单元" />
            <van-field v-model="formData.fdBusinessCenter" name="fdBusinessCenter" readonly label="商务中心" />
            <van-field :value="`${formData.fdSuccessRate || '--'}%`" name="fdSuccessRate" readonly label="预计成交率" />
            <van-field v-model="formData.fdEndTime" name="fdEndTime" readonly label="项目有效截止日期" />
            <van-field v-model="formData.fdUse" name="fdUse" readonly label="用途" type="textarea" />
            <van-field
              :value="(formData.sysBusinessCenterPersonList || []).map((d) => d.fdPersonName).join(',')"
              name="sysBusinessCenterPersonList"
              label="商务中心工程接口人"
            />
            <van-field
              :value="(formData.ccPersonPersonList || []).map((d) => d.fdPersonName).join(',')"
              name="ccPersonPersonList"
              label="抄送人"
            />
            <van-field
              :value="formatAmount(formData.fdProjectSum)"
              name="fdProjectSum"
              readonly
              label="预计成交总金额(元)"
            />
            <van-field
              :value="formData.fdProjectDesc"
              name="fdProjectDesc"
              readonly
              label="项目情况简介"
              type="textarea"
            />
          </block>
          <site-list readonly v-model="formData" />
          <block theme="primary" title="客户信息">
            <van-field v-model="formData.fdProjectManner" name="fdProjectManner" readonly label="项目方式" />
            <template v-if="!!formData.fdProjectManner">
              <van-field v-model="formData.fdCustName" name="fdCustName" readonly label="客户/代理商" />
              <van-field v-model="formData.fdSapCustName" name="fdSapCustName" readonly label="SAP中客户名称" />
              <van-field v-model="formData.fdChannelOneName" name="fdChannelOneName" readonly label="一级渠道" />
              <van-field v-model="formData.fdChannelTwoName" name="fdChannelTwoName" readonly label="二级渠道" />
              <!-- <van-field
                v-model="formData.fdChannelThreeName"
                name="fdChannelThreeName"
                readonly
                label="三级渠道"
              /> -->
              <van-field
                v-model="formData.fdTianyanchaName"
                name="fdTianyanchaName"
                readonly
                v-if="formData.fdProjectManner === '代理商操作'"
                label="终端客户名称"
              />
            </template>
          </block>
          <block theme="primary" title="其他信息">
            <van-field v-model="formData.fdUserName" name="fdUserName" readonly label="关联业务员" />
            <van-field v-model="formData.fdClueName" name="fdClueName" readonly label="关联线索" />
            <van-field
              :value="formData.sysDatascopePersonAspectParams.map((d) => d.fdPersonName).join(',')"
              name="sysDatascopePersonAspectParams"
              readonly
              label="团队其他成员"
            />
            <van-field name="sysAttContractAspectParams" readonly label="其他资料">
              <pictrue-uploader readonly v-model="formData.sysAttContractAspectParams" />
            </van-field>
          </block>

          <more-info readonly :value="formData" />

          <audit-info readonly :moduleId="id" moduleFlag="cpms_project_main" />

          <van-tabs>
            <van-tab title="项目干系人">
              <party-list readonly v-model="formData" />
            </van-tab>
            <van-tab title="项目地址">
              <address-list readonly v-model="formData" />
            </van-tab>
            <van-tab title="产品信息">
              <product-list readonly v-model="formData" />
            </van-tab>
            <van-tab title="拜访信息">
              <visit-panel readonly :moduleId="id" />
            </van-tab>
            <van-tab title="授权信息">
              <grant-panel readonly :moduleId="id" />
            </van-tab>
            <van-tab title="价格信息">
              <price-panel readonly :moduleId="id" />
            </van-tab>
            <van-tab title="合同信息">
              <contract-panel readonly :moduleId="id" />
            </van-tab>
            <van-tab title="审批记录">
              <audit-record readonly :moduleId="id" moduleFlag="cpms_project_main" />
            </van-tab>
            <van-tab title="操作记录">
              <modify-record readonly :moduleId="id" moduleFlag="cpms_project_main" />
            </van-tab>
            <!-- <van-tab title="跟进记录">
              <follow-record
                readonly
                :moduleId="id"
                moduleFlag="cpms_project_main"
              />
            </van-tab> -->
          </van-tabs>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { userMixin, formatMixin } from '@/mixins';
import PartyList from '../ProjectEdit/party-list';
import AddressList from '../ProjectEdit/address-list';
import ProductList from '../ProjectEdit/product-list';
import SiteList from '../ProjectEdit/site-list';
import formMixin from '../ProjectEdit/form';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import ModifyRecord from '@/views/components/modify-record';
import FollowRecord from '@/views/components/follow-record';
import VisitPanel from '../ProjectFollow/visit-panel.vue';
import MoreInfo from '@/views/components/more-info';
import GrantPanel from '../ProjectFollow/grant-panel.vue';
import PricePanel from '../ProjectFollow/price-panel.vue';
import ContractPanel from '../ProjectFollow/contract-panel.vue';
import { CorporateText } from '@/views/components/selection/corporate';
import { CloseTypeText } from '../components/selection/close-type';

import { commonMixin } from '@/views/mixins';

export default {
  name: 'ProjectDetail',
  mixins: [userMixin, formMixin, formatMixin, commonMixin],
  components: {
    PartyList,
    AddressList,
    ProductList,
    SiteList,
    AuditRecord,
    ModifyRecord,
    AuditInfo,
    FollowRecord,
    MoreInfo,
    CloseTypeText,
    CorporateText,
    VisitPanel,
    GrantPanel,
    PricePanel,
    ContractPanel,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
};
</script>

<style lang="scss" scoped></style>
