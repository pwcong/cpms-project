<template>
  <p-spin :spinning="loading">
    <list-layout class="salesorder-detail" style="padding-bottom: 16px">
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
              <p-breadcrumb-item>订单管理</p-breadcrumb-item>
              <p-breadcrumb-item>销售单详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
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
              type="primary"
              v-if="checkButton(formData, 'delete')"
              @click="handleDel(formData)"
              >删除
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>

        <block theme="primary" title="开单信息" style="margin-top: 16px">
          <template #title>
            <span>开单信息</span>
            <div
              v-if="formData.fdStatus === 'error'"
              class="order-error"
              @click="showAbnormalOrder = true"
            >
              <span> 下单异常，点击查看详情 </span>
              <p-icon type="exclamation-circle" />
            </div>
          </template>

          <template #action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>

          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="关联项目" prop="fdProjectName">
                <p-input readOnly v-model="formData.fdProjectName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="单据类型" prop="fdBillType">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_order_bill_type"
                  :value="
                    !!formData.fdBillType
                      ? [
                          {
                            value: formData.fdBillType,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdBranchCompanyCode">
                <select-sap-company
                  readOnly
                  allow-clear
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
            <p-col :span="8"
              ><p-form-model-item label="开单日期" prop="fdBillCreateDate">
                <!-- <p-date-picker
                  valueFormat="YYYY-MM-DD"
                  v-model="formData.fdBeginTime" /> -->
                <p-input
                  readOnly
                  :value="formatDate(formData.fdBillCreateDate)"
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdBusiness">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdBusiness
                      ? [
                          {
                            value: formData.fdBusiness,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="销售部" prop="fdSaleOfficeCode">
                <select-sap-sale
                  readOnly
                  :sapCompanyCode="formData.fdBranchCompanyCode"
                  :value="
                    !!formData.fdSaleOfficeCode
                      ? [
                          {
                            value: formData.fdSaleDeptCode,
                            text: formData.fdSaleOfficeName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <!-- <p-col :span="8">
              <p-form-model-item label="销售单状态" prop="fdName6">
                <p-input readOnly v-model="formData.fdName" />
              </p-form-model-item>
            </p-col> -->
          </p-row>
        </block>

        <block theme="primary" title="客户信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="CPMS客户名称" prop="fdCpmsCustName">
                <p-input readOnly v-model="formData.fdCpmsCustName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户订单号" prop="fdCustOrderNo">
                <p-input readOnly v-model="formData.fdCustOrderNo" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="开票信息" prop="fdInvoiceMsg">
                <p-input readOnly v-model="formData.fdInvoiceMsg" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="要货客户" prop="fdApplyCustomerName">
                <p-input readOnly v-model="formData.fdApplyCustomerName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="结算客户" prop="fdSettleCustomerName">
                <p-input readOnly v-model="formData.fdSettleCustomerName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="配送客户" prop="fdShipCustomerName">
                <p-input readOnly v-model="formData.fdShipCustomerName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="业务员" prop="fdSalesMan">
                <p-input readOnly v-model="formData.fdSalesMan" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="oa账号" prop="fdLoginName">
                <p-input readOnly v-model="formData.fdUserName" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block theme="primary" title="配送信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="配送方式" prop="fdShipType">
                <select-dict
                  readOnly
                  systemCode="cpms"
                  dictCode="cpms_order_ship_type"
                  :value="
                    !!formData.fdShipType
                      ? [
                          {
                            value: formData.fdShipType,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="16">
              <p-form-model-item label="配送地址" prop="fdAddrDetail">
                <p-input
                  readOnly
                  :value="`${formData.fdAddrProvince ? formData.fdAddrProvince : ''}${
                    formData.fdAddrCity ? formData.fdAddrCity : ''
                  }${formData.fdAddrRegion ? formData.fdAddrRegion : ''}${
                    formData.fdAddrDetail ? formData.fdAddrDetail : ''
                  }`"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="收货人" prop="fdAddrContactName">
                <p-input readOnly v-model="formData.fdAddrContactName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="收货人电话" prop="fdAddrMobile">
                <p-input readOnly v-model="formData.fdAddrMobile" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item
                v-if="formData.fdBillType === 'ELECTRONIC_SALES_ORDER'"
                label="收货人身份证"
                prop="fdAddrIdentityCode"
              >
                <p-input
                  readOnly
                  v-model="formData.fdAddrIdentityCode"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="送装一体化" prop="fdIsDistribution">
                <select-yes-or-no
                  readOnly
                  :value="
                    !!formData.fdIsDistribution
                      ? [
                          {
                            value: formData.fdIsDistribution,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <credit-info
          mode="view"
          :value="formData"
          :moduleId="id"
          style="margin-top: 16px"
        />

        <product-list
          :value="formData"
          v-if="formData.fdStatus === 'draft'"
          :moduleId="id"
          style="margin-top: 16px"
          readOnly
        />
        <order-product-list
          v-else
          :value="formData"
          :moduleId="id"
          @change="initFormData(id)"
          style="margin-top: 16px"
        />

        <block theme="primary" title="附加信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="订单备注" prop="fdOrderRemark">
                <p-textarea
                  readOnly
                  v-model="formData.fdOrderRemark"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="自动生成" prop="fdOrderRemark2">
                <p-textarea
                  readOnly
                  v-model="formData.fdOrderRemark2"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="附件">
                <uploader readOnly :value="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <more-info :value="formData" />
      </p-form-model>

      <!-- 异常产品单 -->
      <abnormal-product-list :moduleId="id" :visible.sync="showAbnormalOrder" />
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import MoreInfo from '@/views/components/more-info';
import SelectSapCompany from '@/views/components/select/sap-company';
import SelectSapSale from '@/views/components/select/sap-sale';
import formMixin from '../SalesOrderEdit/form';
import { formatMixin, userMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import CreditInfo from '../SalesOrderEdit/credit-info';
import ProductList from '../SalesOrderEdit/product-list';
import OrderProductList from './order-product-list';
import AbnormalProdectList from './abnormal-product-list';

export default {
  name: '销售单详情',
  mixins: [formMixin, formatMixin, userMixin, commonMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
      showAbnormalOrder: false,
    };
  },
  components: {
    SelectSapCompany,
    SelectSapSale,
    CreditInfo,
    OrderProductList,
    ProductList,
    'abnormal-product-list': AbnormalProdectList,
    MoreInfo,
    SelectYesOrNo,
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
        case 'todo':
          return '待处理';
        case 'pushing':
          return '推送中';
        case 'complete':
          return '已完成';
        case 'draft':
          return '暂存';
        case 'error':
          return '下单异常';
        case 'ready':
          return '待发货';
        case 'part':
          return '部分发货';
        case 'invalid':
          return '已作废';
        default:
          return v;
      }
    },
  },
  methods: {
    // 删除逻辑
    handleDel(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.order.delOrderMain(record.id);
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

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.salesorder-detail {
  .order-error {
    margin-left: 8px;
    display: inline-block;
    font-size: 12px;
    color: $theme-color;
    user-select: none;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>
