<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>订单管理</p-breadcrumb-item>
              <p-breadcrumb-item>
                销售单{{ isEdit ? '编辑' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdStatus === 'draft'"
            >
              暂存
            </p-button>

            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit()"
              :loading="loading"
            >
              {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>

            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>

        <block theme="primary" title="开单信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="关联项目" prop="fdProjectName">
                <select-project
                  status="follow"
                  allow-clear
                  :value="
                    !!formData.fdProjectName
                      ? [
                          {
                            value: formData.fdProjectId,
                            text: formData.fdProjectName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="handleChangeProject"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="单据类型" prop="fdBillType">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_order_bill_type"
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdBillType
                      ? [
                          {
                            value: formData.fdBillType,
                          },
                        ]
                      : []
                  "
                  @change="handleFdBillType"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdBranchCompanyCode">
                <select-corporate
                  allow-clear
                  :readOnly="formData.fdBillType === 'RETAIL_ORDER' ? false : true"
                  placeholder="请选择"
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
                  @change="handleFdBranchCompanyCode"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="8"
              ><p-form-model-item label="开单日期" prop="fdBillCreateDate">
                <p-date-picker
                  :disabled-date="disabledStartDate"
                  valueFormat="YYYY-MM-DD"
                  v-model="formData.fdBillCreateDate"
                  @change="handleChangeFdBillCreateDate"
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdBusiness">
                <select-dict
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
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeBusiness"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="销售部" prop="fdSaleOfficeCode">
                <select-sap-sale
                  :sapCompanyCode="formData.fdBranchCompanyCode"
                  :value="
                    !!formData.fdSaleOfficeCode
                      ? [
                          {
                            value: formData.fdSaleOfficeCode,
                            text: formData.fdSaleOfficeName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeFdSaleOfficeCode"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block theme="primary" title="客户信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="CPMS客户名称" prop="fdCpmsCustName">
                <!-- <p-input v-model="formData.fdCpmsCustName" placeholder="请输入" /> -->
                <select-customer
                  placeholder="请选择"
                  allow-clear
                  status="pass"
                  :value="
                    !!formData.fdCpmsCustName
                      ? [
                          {
                            value: formData.fdCpmsCustId,
                            text: formData.fdCpmsCustName,
                          },
                        ]
                      : []
                  "
                  @change="handlenFdCpmsCustName"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户订单号" prop="fdCustOrderNo">
                <p-input
                  :maxLength="100"
                  v-model="formData.fdCustOrderNo"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="开票信息" prop="fdInvoiceMsg">
                <p-input
                  :maxLength="250"
                  v-model="formData.fdInvoiceMsg"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>

          <p-row :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="要货客户" prop="fdApplyCustomerName">
                <select-crm-customer
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdApplyCustomerName
                      ? [
                          {
                            text: formData.fdApplyCustomerName,
                            value: formData.fdApplyCustomerCode,
                          },
                        ]
                      : []
                  "
                  @change="handleFdApplyCustomerName"
                  :customerId="formData.fdCpmsCustId"
                  :branchCode="formData.fdBranchCompanyCode"
                  :deptCode="formData.fdSaleOfficeCode"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="结算客户" prop="fdSettleCustomerName">
                <!-- <select-crm-customer
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdSettleCustomerName
                      ? [
                          {
                            text: formData.fdSettleCustomerName,
                            value: formData.fdSettleCustomerCode,
                          },
                        ]
                      : []
                  "
                  @change="handleFdSettleCustomerName"
                  :customerId="formData.fdCpmsCustId"
                  :branchCode="formData.fdBranchCompanyCode"
                  :deptCode="formData.fdSaleOfficeCode"
                /> -->
                <p-input
                  placeholder="请输入"
                  readOnly
                  v-model="formData.fdSettleCustomerName"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="配送客户" prop="fdShipCustomerName">
                <!-- <select-crm-customer
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdShipCustomerName
                      ? [
                          {
                            text: formData.fdShipCustomerName,
                            value: formData.fdShipCustomerCode,
                          },
                        ]
                      : []
                  "
                  @change="handleFdShipCustomerName"
                  :customerId="formData.fdCpmsCustId"
                  :branchCode="formData.fdBranchCompanyCode"
                  :deptCode="formData.fdSaleOfficeCode"
                /> -->
                <p-input
                  placeholder="请输入"
                  readOnly
                  v-model="formData.fdShipCustomerName"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="CRM业务员" prop="fdSalesManId">
                <select-salesman-list
                  :saleOfficeCode="formData.fdSaleOfficeCode"
                  :value="
                    !!formData.fdSalesManId
                      ? [
                          {
                            value: formData.fdSalesManId,
                            text: formData.fdSalesMan,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeFdSalesManId"
                  placeholder="请选择"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="员工" prop="fdLoginName">
                <p-select-user
                  :max="1"
                  :selectData="
                    !!formData.fdLoginName
                      ? [
                          {
                            uid: formData.fdLoginName,
                            name: formData.fdUserName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @confirm="handleChangeOa"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block
          v-if="!!formData.fdShipCustomerCode || true"
          theme="primary"
          title="配送信息"
          style="margin-top: 16px"
        >
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="配送方式" prop="fdShipType">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_order_ship_type"
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdShipType
                      ? [
                          {
                            value: formData.fdShipType,
                          },
                        ]
                      : []
                  "
                  @change="handleFdShipType"
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
                  placeholder="请选择"
                  @click="handleChangeFdAddDetail"
                />
              </p-form-model-item>
            </p-col>
          </p-row>

          <p-row :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="收货人" prop="fdAddrContactName">
                <p-input
                  :readOnly="formData.fdAddrDetail ? true : false"
                  v-model="formData.fdAddrContactName"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="收货人电话" prop="fdAddrMobile">
                <p-input
                  :readOnly="formData.fdAddrDetail ? true : false"
                  v-model="formData.fdAddrMobile"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item
                v-if="formData.fdBillType === 'ELECTRONIC_SALES_ORDER'"
                label="收货人身份证"
                prop="fdAddrIdentityCode"
              >
                <p-input
                  :readOnly="formData.fdAddrDetail ? true : false"
                  v-model="formData.fdAddrIdentityCode"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="送装一体化" prop="fdIsDistribution">
                <select-yes-or-no
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdIsDistribution
                      ? [
                          {
                            value: formData.fdIsDistribution,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeIsDistribution"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <credit-info
          :crmCode="formData.fdApplyCustomerCode"
          :moduleId="id"
          style="margin-top: 16px"
          @change="handleChangeCreditInfo"
        />

        <product-list
          :fdBillType="formData.fdBillType"
          :readOnly="!!id && formData.fdStatus !== 'draft'"
          :moduleId="id"
          v-model="formData"
          style="margin-top: 16px"
        />

        <block theme="primary" title="附加信息" style="margin-top: 16px">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="订单备注" prop="fdOrderRemark">
                <p-textarea
                  placeholder="请输入"
                  v-model="formData.fdOrderRemark"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="附件" prop="sysAttContractAspectParams">
                <uploader
                  :limit="1024 * 1024 * 5"
                  v-model="formData.sysAttContractAspectParams"
                  multiple
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit()"
            :loading="loading"
          >
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>

      <selection-distribute
        :mode="formData.fdBillType === 'ELECTRONIC_SALES_ORDER' ? 'rdc' : 'default'"
        :crmCode="formData.fdShipCustomerCode"
        :visible.sync="distributeVisible"
        @change="handleChangeContact"
      />

      <selection-bill-type
        :visible.sync="billTypeVisible"
        @change="handleChangeBillType"
      />

      <product-transfer
        title="请选择需要下单的产品"
        mode="transfer"
        :module="source"
        :moduleId="targetId"
        :visible.sync="transferVisible"
        @change="handleTransferProductList"
      />
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import SelectCustomer from '@/views/components/select/customer';
import SelectCorporate from '@/views/components/select/corporate';
import SelectCrmCustomer from '@/views/components/select/crm-customer';
import SelectProject from '@/views/components/select/project';
import SelectSalesmanList from '../components/select/salesman-list';
import SelectSapCompany from '@/views/components/select/sap-company';
import SelectSapSale from '@/views/components/select/sap-sale';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import formMixin, { refreshProductList } from './form';
import { formatMixin } from '@/mixins';
import SelectionDistribute from '../components/selection-distribution';
import SelectionBillType from '../components/selection-billtype';
import CreditInfo from './credit-info';
import ProductList from './product-list';
import { defaultProductItem } from './data';
import ProductTransfer from '../components/product-transfer';

export default {
  name: '销售单编辑',
  mixins: [formMixin, formatMixin],
  data() {
    const { id } = this.$route.params;
    const { source, targetId, targetName } = this.$route.query;
    return {
      id,
      source,
      targetId,
      targetName,
      distributeVisible: false,
      transferVisible: false,
      startValue: null,
      billTypeVisible: false,
    };
  },
  components: {
    CreditInfo,
    ProductList,
    SelectionDistribute,
    SelectSapCompany,
    SelectSapSale,
    SelectProject,
    SelectSalesmanList,
    SelectCrmCustomer,
    SelectCorporate,
    ProductTransfer,
    SelectYesOrNo,
    SelectCustomer,
    SelectionBillType,
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {
    // 开单日期
    handleChangeFdBillCreateDate(res) {
      this.formData.fdBillCreateDate = res === undefined ? '' : res;
    },
    disabledStartDate(startValue) {
      if (!startValue) {
        return false;
      }
      return startValue.valueOf() > new Date().valueOf();
    },
    //配送地址
    handleChangeFdAddDetail() {
      if (this.formData.fdShipCustomerName) {
        this.distributeVisible = true;
      } else {
        this.$message.info('配送客户不能为空!');
      }
    },
    // 客户名称
    handlenFdCpmsCustName(res) {
      this.formData.fdCpmsCustName = (res[0] || {}).text;
      this.formData.fdCpmsCustId = (res[0] || {}).value;
      this.formData.fdApplyCustomerName = '';
      this.formData.fdApplyCustomerCode = '';
      this.formData.fdShipCustomerName = '';
      this.formData.fdShipCustomerCode = '';
      this.formData.fdSettleCustomerName = '';
      this.formData.fdSettleCustomerCode = '';
    },
    handleChangeIsDistribution(res) {
      this.formData.fdIsDistribution = (res[0] || {}).value;
    },
    handleChangeCreditInfo(res) {
      this.formData.orderCreditAddParams = res.orderCreditAddParams.map((d) => ({
        ...d,
        fdProductLineName: d.fdProductLineName,
        fdAvailableAmount: d.fdAvailableAmount,
        fdExpiationAmount: d.fdExpiationAmount,
        fdActualAccountPeriod: d.fdActualAccountPeriod,
        fdExpireDate: d.fdExpireDate,
      }));
    },
    handleChangeContact(res) {
      const v = res[0] || {};

      this.formData.fdAddrContactName = v.contacts;
      this.formData.fdAddrMobile = v.contactsPhone;
      this.formData.fdAddrProvince = v.provinceName;
      this.formData.fdAddrProvinceCode = v.provinceCode;
      this.formData.fdAddrCity = v.cityName;
      this.formData.fdAddrCityCode = v.cityCode;
      this.formData.fdAddrRegion = v.districtName;
      this.formData.fdAddrRegionCode = v.districtCode;
      this.formData.fdAddrDetail = v.detailAddress;
      this.formData.fdAddrIdentityCode = v.identityCard;
      this.formData.fdAddrCode = v.addressCode;
    },
    // 配送方式
    handleFdShipType(res) {
      this.formData.fdShipType =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    // 单据类型
    handleFdBillType(res) {
      this.formData.fdBillType = (res[0] || {}).value || '';
      this.formData.orderProductListAddParamList = [];
    },
    handleChangeBillType(res) {
      this.handleFdBillType(res);
      this.transferVisible = true;
    },
    // 要货客户
    async handleFdApplyCustomerName(res) {
      if (res) {
        this.formData.fdApplyCustomerName = (res[0] || {}).text;
        this.formData.fdApplyCustomerCode = (res[0] || {}).value;
      }

      this.formData.fdAddrProvince = '';
      this.formData.fdAddrCity = '';
      this.formData.fdAddrRegion = '';
      this.formData.fdAddrDetail = '';
      this.formData.fdAddrContactName = '';
      this.formData.fdAddrMobile = '';
      this.formData.fdAddrIdentityCode = '';

      this.formData.orderProductListAddParamList = [];

      if (!this.formData.fdApplyCustomerCode) {
        this.formData.fdSalesMan = '';
        this.formData.fdSalesManId = '';
        this.formData.fdLoginName = '';
        this.formData.fdUserName = '';
        this.formData.fdSettleCustomerName = '';
        this.formData.fdSettleCustomerCode = '';
        this.formData.fdShipCustomerName = '';
        this.formData.fdShipCustomerCode = '';
        this.formData.orderCreditAddParams = [];
        return;
      } else {
        // 带出结算,配送客户
        api.order
          .getFindCustomerbMsg(this.formData.fdApplyCustomerCode)
          .then((res) => {
            this.formData.fdSettleCustomerName = res.data.fdSettleCustomerName;
            this.formData.fdSettleCustomerCode = res.data.fdSettleCustomerCode;
            this.formData.fdShipCustomerName = res.data.fdReceiverCustomerName;
            this.formData.fdShipCustomerCode = res.data.fdReceiverCustomerCode;
          })
          .catch(() => {});

        // 获取客户信息
        await api.order
          .getFindCrmParty({
            page: 1,
            size: 10,
            keyword: this.formData.fdApplyCustomerCode,
            // keyword: 'NNJTV.LZZB',
          })
          .then((res) => {
            this.formData.fdSalesMan = (res[0] || {}).salesmanName;
            this.formData.fdSalesManId = (res[0] || {}).salesmanCode;
          })
          .catch(() => {});

        // 业务员带出员工
        if (this.formData.fdSalesManId && this.formData.fdSalesMan) {
          const orderCrmOaList = await api.order.getOrderCrmOaList({
            fdCrmLoginName: this.formData.fdSalesManId,
            fdCrmUserName: this.formData.fdSalesMan,
          });

          (orderCrmOaList.data || []).map((d) => {
            this.formData.fdLoginName = d.fdOaLoginName;
            this.formData.fdUserName = d.fdOaUserName;
          });
        }
      }
    },

    // 关联项目
    handleChangeProject(res) {
      this.formData.fdProjectName = (res[0] || {}).text;
      this.formData.fdApplyCustomerName = '';
      this.formData.fdApplyCustomerCode = '';
      this.handleFdApplyCustomerName();
      // this.formData.orderProductListAddParamList = [];
      this.formData.fdShipCustomerName = '';
      this.formData.fdShipCustomerCode = '';
      this.formData.fdSettleCustomerName = '';
      this.formData.fdSettleCustomerCode = '';
      this.formData.fdSalesManId = '';
      this.formData.fdSalesMan = '';
      this.formData.fdLoginName = '';
      this.formData.fdUserName = '';

      this.loadProject((res[0] || {}).value);
    },
    // 销售部
    handleChangeFdSaleOfficeCode(res) {
      this.formData.fdSaleOfficeCode = (res[0] || {}).value;
      this.formData.fdSaleOfficeName = (res[0] || {}).text;
      this.formData.fdSalesManId = '';
      this.formData.fdSalesMan = '';
      this.formData.fdApplyCustomerName = '';
      this.formData.fdApplyCustomerCode = '';
      this.formData.fdShipCustomerName = '';
      this.formData.fdShipCustomerCode = '';
      this.formData.fdSettleCustomerName = '';
      this.formData.fdSettleCustomerCode = '';
    },
    // CRM业务员
    async handleChangeFdSalesManId(res) {
      this.formData.fdSalesManId = (res[0] || {}).value;
      this.formData.fdSalesMan = (res[0] || {}).text;
      this.formData.fdLoginName = '';
      this.formData.fdUserName = '';

      // 业务员带出员工
      const orderCrmOaList = await api.order.getOrderCrmOaList({
        fdCrmLoginName: this.formData.fdSalesManId,
        fdCrmUserName: this.formData.fdSalesMan,
      });

      (orderCrmOaList.data || []).map((d) => {
        this.formData.fdLoginName = d.fdOaLoginName;
        this.formData.fdUserName = d.fdOaUserName;
      });
    },
    // 分公司
    handleFdBranchCompanyCode(res) {
      this.formData.fdBranchCompanyCode = (res[0] || {}).value;
      this.formData.fdBranchCompanyName = (res[0] || {}).text;
      this.formData.fdSaleOfficeCode = '';
      this.formData.fdSaleOfficeName = '';
      this.formData.fdApplyCustomerName = '';
      this.formData.fdApplyCustomerCode = '';
      this.formData.fdShipCustomerName = '';
      this.formData.fdShipCustomerCode = '';
      this.formData.fdSettleCustomerName = '';
      this.formData.fdSettleCustomerCode = '';
    },
    async handleSubmit(isDraft) {
      if (this.loading) {
        return;
      }

      // 刷新库存
      this.formData.orderProductListAddParamList = await refreshProductList(
        this,
        this.formData.orderProductListAddParamList
      );

      const handleChangeSubmit = () => {
        if (isDraft) {
          this.$confirm({
            title: '是否确认暂存表单?',
            onOk: () => {
              submit('draft');
            },
            onCancel: () => {},
          });
        } else {
          this.$refs.form.validate((valid) => {
            if (!valid) {
              this.$message.error('表单字段校验未通过');
              return;
            }

            if (!this.checkFormData(this.formData)) {
              return;
            }

            this.$confirm({
              title: '是否确认提交表单?',
              onOk: () => {
                submit(this.isEdit ? 'edit' : 'add');
              },
              onCancel: () => {},
            });
          });
        }
      };

      if (!isDraft) {
        api.order
          .getOrderCrmOaIsExist({
            fdCrmLoginName: this.formData.fdSalesManId,
            fdCrmUserName: this.formData.fdSalesMan,
            fdOaLoginName: this.formData.fdLoginName,
            fdOaUserName: this.formData.fdUserName,
          })
          .then((res) => {
            if (res !== true) {
              this.$confirm({
                title: 'CRM业务员与员工不一致，请确认是否要提交？',
                onOk: () => {
                  handleChangeSubmit();
                },
                onCancel: () => {
                  return;
                },
              });
            } else {
              handleChangeSubmit();
            }
          })
          .catch(() => {});
      } else {
        handleChangeSubmit();
      }

      const submit = (action) => {
        this.submitFormData(this.formData, action);
      };
    },
    handleChangeBusiness(res) {
      this.formData.fdBusiness =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleTransferProductList(res) {
      this.formData.orderProductListAddParamList = res.map((d) => ({
        ...defaultProductItem,
        fdProductLineCode: d.fdProductLineCode,
        fdProductLineName: d.fdProductLineName,
        fdProductCode: d.fdProductCode,
        fdProductName: d.fdProductName,
        fdSalePrice: d.fdSalePrice,
        fdShippingDate: d.fdShippingDate,
        fdCurrentSupplyPrice: d.fdCurrentSupplyPrice,
        fdApplySupplyPrice: d.fdApplySupplyPrice,
        fdApplyCount: d.fdApplyCount,
        fdProductSourceId: d.fdProductSourceId,
        fdProductSourceNo: d.fdProductSourceNo,
        fdProductSourceType: d.fdProductSourceType,
        fdProductListId: d.fdProductListId,
        fdSettleAmount: d.fdSettleAmount,
      }));
    },
    handleChangeOa(list) {
      this.formData.fdLoginName = (list[0] || []).uid;
      this.formData.fdUserName = (list[0] || []).name;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
