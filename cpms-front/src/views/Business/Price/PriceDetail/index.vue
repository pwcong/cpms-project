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
              <p-breadcrumb-item>价格管理</p-breadcrumb-item>
              <p-breadcrumb-item>价格详情</p-breadcrumb-item>
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
              v-if="checkButton(formData, 'priceEdit')"
            >
              编辑
            </p-button>
            <oawithdraw-wrapper
              v-if="checkButton(formData, 'withdrawPrice')"
              :fdModuleId="id"
              fdModuleFlag="cpms_project_price_main"
              style="margin-left: 10px"
              @change="initFormData(id)"
            >
              <p-button type="primary">撤回</p-button>
            </oawithdraw-wrapper>
            <p-button
              style="margin-left: 8px"
              type="primary"
              v-if="checkButton(formData, 'priceEdit')"
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
            <p-col :span="8">
              <p-form-model-item
                label="合同交货时间"
                readOnly
                prop="fdContractDeliveryTime"
              >
                <p-input readOnly :value="formatDate(formData.fdContractDeliveryTime)" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="开始时间" prop="fdBeginTime">
                <p-input readOnly :value="formatDate(formData.fdBeginTime)" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="开单截止时间" prop="fdOrderEndTime">
                <p-input
                  readOnly
                  :value="formatDate(formData.fdOrderEndTime)"
                /> </p-form-model-item
            ></p-col>

            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdBranchCompanyCode">
                <select-sap-company
                  readOnly
                  :value="
                    !!formData.fdBranchCompanyCode
                      ? [
                          {
                            value: formData.fdBranchCompanyCode,
                            text: formData.fdBranchCompanyName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="销售部" prop="fdSaleDeptCode">
                <select-sap-sale
                  readOnly
                  :value="
                    !!formData.fdSaleDeptCode
                      ? [
                          {
                            value: formData.fdSaleDeptCode,
                            text: formData.fdSaleDeptName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="客户名称" prop="fdCustName">
                <p-input readOnly v-model="formData.fdCustName" /> </p-form-model-item
            ></p-col>
            <p-col :span="8">
              <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
                <p-input readOnly v-model="formData.fdSapCustName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="一级渠道" prop="fdChannelOneName">
                <p-input readOnly v-model="formData.fdChannelOneName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
                <p-input readOnly v-model="formData.fdChannelTwoName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="联系人" prop="fdUserName">
                <p-input readOnly v-model="formData.fdUserName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系电话" prop="fdUserMobile">
                <p-input readOnly v-model="formData.fdUserMobile" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目所在城市" prop="fdCity">
                <p-input readOnly v-model="formData.fdCity" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目是否跨区" prop="fdIsRegion">
                <p-input readOnly :value="formData.fdIsRegion > 0 ? '是' : '否'" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目预计收入(元)" prop="fdEstimatedRevenue">
                <p-input readOnly v-model="formData.fdEstimatedRevenue" />
              </p-form-model-item>
            </p-col>

            <!-- <p-col :span='8'>
              <p-form-model-item label="分公司" prop="fdCorporateName">
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
            </p-col> -->

            <p-col :span="24">
              <p-form-model-item label="申请理由" prop="fdApplyReason">
                <p-textarea
                  readOnly
                  v-model="formData.fdApplyReason"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="价格附件">
                <uploader readOnly :value="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <price-list readOnly v-model="formData" :moduleId="id" style="margin-top: 16px" />
        <!-- <install-list
          readOnly
          v-model="formData"
          :moduleId="id"
          style="margin-top: 16px"
        /> -->
        <!-- <transport-list
          readOnly
          v-model="formData"
          :moduleId="id"
          style="margin-top: 16px"
        /> -->
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
            <audit-info readOnly :moduleId="id" moduleFlag="cpms_project_price_main" />
          </p-tab-pane>
          <p-tab-pane key="3" tab="审批记录">
            <audit-record readOnly :moduleId="id" moduleFlag="cpms_project_price_main" />
          </p-tab-pane>
          <p-tab-pane key="4" tab="推送记录">
            <push-record readOnly :moduleId="id" moduleFlag="cpms_project_price_main" />
          </p-tab-pane>
          <!-- <p-tab-pane key="5" tab="销售单信息">
            <sales-order-record
              readOnly
              :moduleId="formData.fdProjectMainId"
              :mainId="formData.id"
              moduleFlag="cpms_project_price_main"
            />
          </p-tab-pane> -->
        </p-tabs>
      </p-form-model>
      <!-- <price-info></price-info> -->
      <!-- 转订单 -->
      <!-- <transfer-order-list
        readOnly
        :moduleId="id"
        type="FROM_PRICE"
        :value="formData"
        :visible.sync="showProductList"
        @change="handleTransferOrder"
        ref="orderList"
      /> -->
    </list-layout>
  </p-spin>
</template>

<script>
import { commonMixin } from '@/views/mixins';
import SelectSapSale from '@/views/components/select/sap-sale';
import SelectSapCompany from '@/views/components/select/sap-company';
import { formatMixin } from '@/mixins';
import SelectCorporate from '@/views/components/select/corporate';
import SelectProject from '@/views/components/select/project';
import formMixin from '../PriceEdit/form';
import PriceList from '../PriceEdit/price-list';
import InstallList from '../PriceEdit/install-list';
import TransportList from '../PriceEdit/transport-list';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import MoreInfo from '@/views/components/more-info';
// import SalesOrderRecord from '@/views/components/salesorder-record';
import PushRecord from '@/views/Business/Price/components/push-record';
// import TransferOrderList from '../../components/transfer-order-list';

export default {
  name: '价格详情',
  mixins: [formMixin, formatMixin, commonMixin],
  components: {
    PriceList,
    InstallList,
    TransportList,
    SelectProject,
    SelectCorporate,
    AuditRecord,
    SelectSapSale,
    SelectSapCompany,
    AuditInfo,
    MoreInfo,
    // SalesOrderRecord,
    PushRecord,
    // TransferOrderList,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
      showProductList: false,
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
  methods: {
    handleDel(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.price.delPriceMain(record.id);
          this.$message.success('删除成功');
          // this.onRefresh();
          this.handleCancel();
        },
        onCancel: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
