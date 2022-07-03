<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>商机管理</p-breadcrumb-item>
              <p-breadcrumb-item>项目详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleTransferOrder(formData.fdName, id)"
              v-if="checkButton(formData, 'order')"
            >
              转订单
            </p-button>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleEdit(id)"
              v-if="checkButton(formData, 'edit')"
            >
              编辑
            </p-button>
            <p-button
              style="margin-left: 8px"
              v-if="checkButton(formData, 'followUp')"
              type="primary"
              @click="handleFollow"
            >
              跟进
            </p-button>
            <p-button
              style="margin-left: 8px"
              v-if="checkButton(formData, 'visit')"
              type="primary"
              @click="handleVisit"
            >
              拜访
            </p-button>
            <p-button
              style="margin-left: 8px"
              v-if="checkButton(formData, 'close')"
              type="primary"
              @click="showProjectClose = true"
            >
              关闭项目
            </p-button>
            <oawithdraw-wrapper
              v-if="checkButton(formData, 'withdrawProject')"
              :fdModuleId="id"
              fdModuleFlag="cpms_project_main"
              style="margin-left: 10px"
              @change="initFormData(id)"
            >
              <p-button type="primary">撤回</p-button>
            </oawithdraw-wrapper>
            <p-button
              style="margin-left: 8px"
              type="primary"
              v-if="checkButton(formData, 'delete')"
              @click="handleDelete(formData)"
            >
              删除
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>

        <block
          v-if="['done', 'lost'].indexOf(formData.fdProjectStatus) > -1"
          title="项目关闭状态"
          style="margin-top: 16px"
          theme="primary"
        >
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="关闭类型" prop="fdProjectStatus">
                <select-close-type
                  read-only
                  :value="
                    !!formData.fdProjectStatus
                      ? [{ value: formData.fdProjectStatus }]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="关闭原因" prop="fdCloseExplain">
                <p-textarea
                  v-model="formData.fdCloseExplain"
                  read-only
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block title="项目信息" style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span>项目信息</span>
              <span
                style="font-size: 12px; color: #e50113"
                v-if="!!formData.fdRepeatPrompt"
              >
                （{{ formData.fdRepeatPrompt }}）
              </span>
            </div>
          </template>

          <template #action>
            <status-seal :status="formData.fdProjectStatus">
              {{ formData.fdProjectStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>

          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="项目名称" prop="fdName">
                <p-input v-model="formData.fdName" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目类型" prop="fdProjectTypeId">
                <select-project-type
                  read-only
                  :type="1"
                  :value="
                    !!formData.fdProjectTypeId
                      ? [
                          {
                            value: formData.fdProjectTypeId,
                            text: formData.fdProjectTypeName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目招投标编号" prop="fdTenderNum">
                <p-input v-model="formData.fdTenderNum" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdBusinessCode">
                <select-dict
                  read-only
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdBusinessCode
                      ? [
                          {
                            value: formData.fdBusinessCode,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdCorporateCode">
                <select-corporate
                  read-only
                  :value="
                    !!formData.fdCorporateCode
                      ? [
                          {
                            value: formData.fdCorporateCode,
                            text: formData.fdCorporateName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="业务单元" prop="fdAgencyCode">
                <p-input :value="formData.fdAgencyName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="商务中心" prop="fdBusinessCenter">
                <p-input :value="formData.fdBusinessCenter" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="预计成交率" prop="fdSuccessRate">
                <select-rate
                  read-only
                  :value="
                    !!formData.fdSuccessRate
                      ? [
                          {
                            value: formData.fdSuccessRate,
                            text: formData.fdSuccessRate,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目有效截止日期" prop="fdEndTime">
                <p-input v-model="formData.fdEndTime" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="预计成交总金额(元)" prop="fdProjectSum">
                <p-input
                  style="width: 100%"
                  :value="formatAmount(formData.fdProjectSum)"
                  read-only
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="用途" prop="fdUse" readOnly>
                <p-input
                  v-model="formData.fdUse"
                  read-only
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="16">
              <p-form-model-item
                label="商务中心工程接口人"
                prop="sysBusinessCenterPersonList"
                readOnly
              >
                <p-input
                  :value="
                    (formData.sysBusinessCenterPersonList || [])
                      .map((d) => d.fdPersonName)
                      .join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="抄送人" prop="ccPersonPersonList" readOnly>
                <p-input
                  :value="
                    (formData.ccPersonPersonList || [])
                      .map((d) => d.fdPersonName)
                      .join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>

            <!-- <p-row>
            <p-col :span="24">
              <p-form-model-item
                label="项目所在地"
                prop="projectSites"
              >
                <site-list readOnly style="width: 100%" v-model="formData" />
              </p-form-model-item>
            </p-col>
          </p-row> -->

            <p-col :span="24">
              <p-form-model-item label="项目情况简介" prop="fdProjectDesc">
                <p-textarea
                  v-model="formData.fdProjectDesc"
                  read-only
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <site-list readOnly style="margin-top: 16px" v-model="formData" />

        <block title="客户信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="项目方式" prop="fdProjectManner">
                <select-project-manner
                  read-only
                  :value="
                    !!formData.fdProjectManner
                      ? [
                          {
                            value: formData.fdProjectManner,
                            text: formData.fdProjectManner,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <template v-if="!!formData.fdProjectManner">
              <p-col :span="8">
                <p-form-model-item label="客户/代理商" prop="fdCustMainId">
                  <p-input v-model="formData.fdCustName" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
                  <p-input v-model="formData.fdSapCustName" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="一级渠道" prop="fdChannelOneName">
                  <p-input v-model="formData.fdChannelOneName" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
                  <p-input v-model="formData.fdChannelTwoName" read-only />
                </p-form-model-item>
              </p-col>
              <!-- <p-col :span="8">
                <p-form-model-item label="三级渠道" prop="fdChannelThreeName">
                  <p-input v-model="formData.fdChannelThreeName" read-only />
                </p-form-model-item>
              </p-col> -->
              <p-col :span="8">
                <p-form-model-item
                  label="终端客户名称"
                  prop="fdTianyanchaName"
                  v-if="formData.fdProjectManner === '代理商操作'"
                >
                  <p-input v-model="formData.fdTianyanchaName" read-only />
                </p-form-model-item>
              </p-col>
            </template>
          </p-row>
        </block>

        <block title="其他信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="关联业务员" prop="fdLoginName">
                <p-input :value="formData.fdUserName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关联线索" prop="fdClueName">
                <p-input :value="formData.fdClueName" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item
                label="团队其他成员"
                prop="sysDatascopePersonAspectParams"
              >
                <p-input
                  :value="
                    formData.sysDatascopePersonAspectParams
                      .map((d) => d.fdPersonName)
                      .join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="其他资料" prop="sysAttContractAspectParams">
                <uploader
                  multiple
                  readOnly
                  v-model="formData.sysAttContractAspectParams"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <more-info style="margin-top: 16px" :value="formData" />

        <audit-info
          style="margin-top: 16px"
          :moduleId="id"
          moduleFlag="cpms_project_main"
        />

        <p-tabs
          style="
            margin-top: 16px;
            padding: 12px 16px;
            box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2);
          "
        >
          <p-tab-pane key="contact-panel" tab="项目干系人">
            <party-list readOnly v-model="formData" />
          </p-tab-pane>
          <p-tab-pane key="address-panel" tab="项目地址">
            <address-list readOnly v-model="formData" />
          </p-tab-pane>
          <p-tab-pane key="product-panel" tab="产品信息">
            <product-list readOnly v-model="formData" />
          </p-tab-pane>
          <p-tab-pane key="visit-panel" tab="拜访信息">
            <visit-panel :moduleId="id" />
          </p-tab-pane>
          <p-tab-pane key="accredit-panel" tab="授权信息">
            <grant-panel :moduleId="id" />
          </p-tab-pane>
          <p-tab-pane key="price-panel" tab="价格信息">
            <price-panel :moduleId="id" />
          </p-tab-pane>
          <p-tab-pane key="contract-panel" tab="合同信息">
            <contract-panel :moduleId="id" />
          </p-tab-pane>
          <p-tab-pane key="audit-panel" tab="审批记录">
            <audit-record readOnly :moduleId="id" moduleFlag="cpms_project_main" />
          </p-tab-pane>
          <p-tab-pane key="modify-panel" tab="操作记录">
            <modify-record readOnly :moduleId="id" moduleFlag="cpms_project_main" />
          </p-tab-pane>
          <!-- <p-tab-pane key="sales-panel" tab="销售单信息">
            <sales-order-record
              readOnly
              :moduleId="id"
              :mainId="id"
              moduleFlag="cpms_project_main"
            />
          </p-tab-pane> -->
        </p-tabs>
      </p-form-model>
      <!-- 关闭项目 -->
      <project-close
        :moduleId="id"
        :visible.sync="showProjectClose"
        @change="initFormData(id)"
      />
      <!-- 删除 -->
      <!-- <cancel-operation
        :moduleId="selectedId"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      /> -->
      <!-- 转订单 -->
      <!-- <transfer-order-list
        readOnly
        :moduleId="id"
        type="FROM_PROJECT"
        :value="formData"
        :visible.sync="showProductList"
        @change="handleTransferOrder"
      /> -->
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from '../ProjectEdit/form';
import { formatMixin, userMixin } from '@/mixins';
import api from '@/api';
import SelectCloseType from '../components/select/close-type';
import PartyList from '../ProjectEdit/party-list';
import AddressList from '../ProjectEdit/address-list';
import ProductList from '../ProjectEdit/product-list';
import SiteList from '../ProjectEdit/site-list';
import SelectProjectType from '../components/select/project-type';
import SelectProjectManner from '../components/select/project-manner';
import SelectRate from '../components/select/rate';
import SelectCorporate from '@/views/components/select/corporate';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SettingName from '../ProjectEdit/setting-name';
import SelectionCustomer from '@/views/components/selection-customer';
import SelectionTianyancha from '@/views/components/selection-tianyancha';
import ProjectClose from '../components/project-close';
import AuditRecord from '@/views/components/audit-record';
import ModifyRecord from '@/views/components/modify-record';
import AuditInfo from '@/views/components/audit-info';
import MoreInfo from '@/views/components/more-info';
// import SalesOrderRecord from '@/views/components/salesorder-record';
import { commonMixin } from '@/views/mixins';
import GrantPanel from '../ProjectFollow/grant-panel';
import PricePanel from '../ProjectFollow/price-panel';
import ContractPanel from '../ProjectFollow/contract-panel';
import VisitPanel from '../ProjectFollow/visit-panel';
// import TransferOrderList from '../components/transfer-order-list';
// import CancelOperation from '../../Business/components/operations/cancel';

export default {
  name: '项目详情',
  mixins: [formMixin, formatMixin, userMixin, commonMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showMap: false,
      showProjectClose: false,
      inited: false,
      // showProductList: false,
      // cancelVisible: false,
    };
  },
  components: {
    SelectCloseType,
    PartyList,
    AddressList,
    ProductList,
    SiteList,
    SelectProjectType,
    SelectCorporate,
    SettingName,
    SelectionCustomer,
    SelectionTianyancha,
    SelectProjectManner,
    SelectRate,
    SelectYesOrNo,
    ProjectClose,
    AuditRecord,
    ModifyRecord,
    AuditInfo,
    MoreInfo,
    // SalesOrderRecord,
    GrantPanel,
    PricePanel,
    ContractPanel,
    VisitPanel,
    // TransferOrderList,
    // CancelOperation,
  },

  computed: {
    isEdit() {
      return !!this.id;
    },
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
  methods: {
    // handleTransferOrder(event) {
    //   setTimeout(() => {
    //     this.$router.push({
    //       path: `/Order/SalesOrderCreate`,
    //       query: {
    //         source: 'project',
    //         targetName: this.formData.fdName,
    //         targetId: this.id,
    //       },
    //     });
    //   }, 300);
    // },
    handleVisit() {
      this.$router.push({
        path: `/Salesman/Visit/VisitCreate`,
        query: {
          source: 'project',
          targetId: this.id,
        },
      });
    },
    handleFollow() {
      this.$router.push({
        path: `/Business/ProjectFollow/${this.id}`,
        query: {
          projectTypeId: this.formData.fdProjectTypeId,
          projectTypeName: this.formData.fdProjectTypeName,
        },
      });
    },
    // 删除按钮
    handleDelete(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.business.postCloseProject({
            id: record.id,
            fdIsValid: '0',
          });
          this.$message.success('删除成功');
          // this.onRefresh();
          this.handleCancel();
        },
        onCancel: () => {},
      });
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '报备审批中';
        case 'reject':
          return '审批驳回';
        case 'follow':
          return '跟进中';
        case 'lost':
          return '已丢单';
        case 'draft':
          return '草稿';
        case 'done':
          return '已成交';
        default:
          return v;
      }
    },
  },
};
</script>
