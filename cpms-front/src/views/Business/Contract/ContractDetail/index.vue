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
              <p-breadcrumb-item>合同管理</p-breadcrumb-item>
              <p-breadcrumb-item>合同详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleTransferOrder(formData.fdProjectMainName, id)"
              v-if="checkButton(formData, 'order')"
            >
              转订单
            </p-button>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleEdit(id)"
              v-if="checkButton(formData, 'contractEdit')"
            >
              编辑
            </p-button>
            <oawithdraw-wrapper
              v-if="checkButton(formData, 'withdrawContract')"
              :fdModuleId="id"
              fdModuleFlag="cpms_project_contract_main"
              style="margin-left: 10px"
              @change="initFormData(id)"
            >
              <p-button type="primary">撤回</p-button>
            </oawithdraw-wrapper>
            <p-button
              style="margin-left: 8px"
              type="primary"
              v-if="checkButton(formData, 'contractEdit')"
              @click="handleDel(formData)"
              >删除
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel()"> 返回 </p-button>
          </template>
        </block>

        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <template #action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="项目名称" prop="fdProjectMainName">
                <select-project
                  readOnly
                  :value="
                    !!formData.fdProjectMainName
                      ? [
                          {
                            value: formData.fdProjectMainId,
                            text: formData.fdProjectMainName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8"
              ><p-form-model-item label="客户名称" prop="fdCustName">
                <div>
                  <p-input v-model="formData.fdCustName" readOnly />
                  <!-- <p-button type="primary">查看详情</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="CRM客户名称">
                <div>
                  <p-input readOnly v-model="formData.fdSapCustName" />
                  <!-- <p-button type="primary">转正式客户</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="先行盖章方">
                <select-dict
                  readOnly
                  :value="
                    !!formData.fdFirstSealCode
                      ? [
                          {
                            value: formData.fdFirstSealCode,
                          },
                        ]
                      : []
                  "
                  systemCode="cpms"
                  dictCode="cpms_first_seal" /></p-form-model-item
            ></p-col>

            <p-col :span="8"
              ><p-form-model-item label="分公司">
                <select-corporate
                  readOnly
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

            <p-col :span="4">
              <p-form-model-item label="合同正本数量-对方">
                <div style="display: flex">
                  <p-input v-model="formData.fdQuantityParty" readOnly />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="4">
              <p-form-model-item label="合同正本数量-我方">
                <div style="display: flex">
                  <p-input v-model="formData.fdQuantityWe" readOnly />
                </div>
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="8"
              ><p-form-model-item label="事务类别">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_business_type"
                  :value="
                    !!formData.fdBusinessTypeCode
                      ? [
                          {
                            value: formData.fdBusinessTypeCode,
                          },
                        ]
                      : []
                  "
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8"
              ><p-form-model-item label="印章类型">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_seal_type"
                  :value="
                    !!formData.fdSealTypeCode
                      ? [
                          {
                            value: formData.fdSealTypeCode,
                          },
                        ]
                      : []
                  "
                /> </p-form-model-item
            ></p-col>

            <p-col :span="8"
              ><p-form-model-item label="合同类别">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_contract_type"
                  :value="
                    !!formData.fdContractTypeCode
                      ? [
                          {
                            value: formData.fdContractTypeCode,
                          },
                        ]
                      : []
                  " /></p-form-model-item
            ></p-col>
            <p-col :span="8"
              ><p-form-model-item label="合同模板">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_contract_template"
                  :value="
                    !!formData.fdContractTemplateCode
                      ? [
                          {
                            value: formData.fdContractTemplateCode,
                          },
                        ]
                      : []
                  "
                /> </p-form-model-item
            ></p-col>

            <p-col :span="8"
              ><p-form-model-item label="期限内合同金额(元)">
                <p-input
                  readOnly
                  v-model="formData.fdTermContractPrice"
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8"
              ><p-form-model-item label="合同开始时间">
                <p-input
                  readOnly
                  :value="formatDate(formData.fdBeginTime)"
                /> </p-form-model-item
            ></p-col>

            <p-col :span="8"
              ><p-form-model-item label="合同截至时间">
                <p-input
                  readOnly
                  :value="formatDate(formData.fdEndTime)"
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8">
              <p-form-model-item label="合同相对方全称">
                <p-input readOnly v-model="formData.fdPartyFullName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="金额为0理由">
                <p-input
                  readOnly
                  v-model="formData.fdPriceZeroReason" /></p-form-model-item
            ></p-col>
            <p-col :span="8"
              ><p-form-model-item label="业务范畴">
                <select-dict
                  readOnly
                  :value="
                    !!formData.fdBusinessScopeCode
                      ? [
                          {
                            value: formData.fdBusinessScopeCode,
                          },
                        ]
                      : []
                  "
                  systemCode="cpms"
                  dictCode="cpms_business_scope" /></p-form-model-item
            ></p-col>

            <p-col :span="8"
              ><p-form-model-item label="合同附件主题">
                <p-input readOnly v-model="formData.fdContractTitle" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="合同附件">
                <uploader readOnly :value="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>
            <p-col :span="24"
              ><p-form-model-item label="合同内容概述">
                <p-textarea
                  readOnly
                  v-model="formData.fdContentDescribe"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="直管/分部领导">
                <p-input
                  readOnly
                  :value="formData.fdLeaderList.map((d) => d.fdPersonName).join(',')"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="一级部门负责人/商总">
                <p-input
                  readOnly
                  :value="formData.fdManagerList.map((d) => d.fdPersonName).join(',')"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8"
              ><p-form-model-item label="其他相关领导">
                <p-input
                  readOnly
                  :value="formData.fdOtherList.map((d) => d.fdPersonName).join(',')"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <contract-list
          readOnly
          style="margin-top: 16px"
          v-model="formData"
          :moduleId="id"
        ></contract-list>

        <!-- <install-list readOnly v-model="formData" :moduleId="id"></install-list> -->
        <!-- <transport-list
        readOnly
        v-model="formData"
        :moduleId="id"
      ></transport-list> -->

        <p-tabs
          style="
            margin-top: 16px;
            padding: 12px 16px;
            box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2);
          "
        >
          <p-tab-pane key="1" tab="更多信息">
            <more-info :value="formData" />
          </p-tab-pane>
          <p-tab-pane key="2" tab="审批信息">
            <audit-info readOnly :moduleId="id" moduleFlag="cpms_project_contract_main" />
          </p-tab-pane>
          <p-tab-pane key="3" tab="审批记录">
            <audit-record
              readOnly
              :moduleId="id"
              moduleFlag="cpms_project_contract_main"
            />
          </p-tab-pane>
          <!-- <p-tab-pane key="4" tab="销售单信息">
            <sales-order-record
              readOnly
              :moduleId="formData.fdProjectMainId"
              :mainId="formData.id"
              moduleFlag="cpms_project_contract_main"
            />
          </p-tab-pane> -->
        </p-tabs>
      </p-form-model>
      <!-- 转订单 -->
      <!-- <transfer-order-list
        readOnly
        :moduleId="id"
        type="FROM_CONTRACT"
        :value="formData"
        :visible.sync="showProductList"
        @change="handleTransferOrder"
      /> -->
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import { formatMixin } from '@/mixins';
import SelectCorporate from '@/views/components/select/corporate';
import ContractList from '../ContractEdit/contract-list';
import formMixin from '../ContractEdit/form';
import { commonMixin } from '@/views/mixins';
import SelectProject from '@/views/components/select/project';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import MoreInfo from '@/views/components/more-info';
// import SalesOrderRecord from '@/views/components/salesorder-record';
import InstallList from '../ContractEdit/install-list';
import TransportList from '../ContractEdit/transport-list';
// import TransferOrderList from '../../components/transfer-order-list';

export default {
  name: '合同详情',
  mixins: [formMixin, formatMixin, commonMixin],
  components: {
    ContractList,
    // SelectCustomer,
    SelectProject,
    InstallList,
    TransportList,
    AuditRecord,
    SelectCorporate,
    AuditInfo,
    MoreInfo,
    // SalesOrderRecord,
    // TransferOrderList,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  methods: {
    handleDel(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.contract.delContractMain(record.id);
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
        case 'draft':
          return '草稿';
        case 'todo':
          return '待审批';
        case 'reject':
          return '驳回';
        case 'pass':
          return '审批通过';
        case 'audit':
          return '审批中';
        default:
          return v;
      }
    },
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
};
</script>

<style lang="scss" scoped></style>
