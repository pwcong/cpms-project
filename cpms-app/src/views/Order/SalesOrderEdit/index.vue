<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}销售单`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : ''"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="开单信息">
            <van-field
              v-if="formData.fdBillType === 'NORMAL_SALES_ORDER'"
              v-model="formData.fdProjectName"
              is-link
              readonly
              clickable
              name="fdProjectName"
              label="关联项目"
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择关联项目',
                  trriger: 'change',
                },
              ]"
              @click="showProject = true"
            />
            <van-field
              v-else
              v-model="formData.fdProjectName"
              is-link
              readonly
              clickable
              name="fdProjectName"
              label="关联项目"
              placeholder="请选择"
              @click="showProject = true"
            />

            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              v-model="formData.fdBillType"
              name="fdBillType"
              label="单据类型"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择单据类型',
                  trriger: 'change',
                },
              ]"
              @click="showBillType = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdBillType || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_order_bill_type"
                />
              </template>
            </van-field>
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              v-model="formData.fdBranchCompanyName"
              name="fdBranchCompanyName"
              label="分公司"
              @click="showBranchCompanyCode = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择开单日期',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdBillCreateDate"
              name="fdBillCreateDate"
              label="开单日期"
              @click="showBillCreateDate = true"
            />
            <!-- <van-field
              placeholder="请输入"
              v-model="formData.fdQuantityWe"
              name="fdQuantityWe"
              oninput="value=value.replace(/[^\d]/g,'')"
              label="合同正本数量-我方"
            /> -->
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              v-model="formData.fdBusiness"
              name="fdBusiness"
              label="所属行业"
              @click="showCorporateCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdBusiness || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business"
                />
              </template>
            </van-field>
            <van-field
              is-link
              readonly
              clickable
              required
              placeholder="请选择"
              :rules="[
                {
                  required: true,
                  message: '请选择销售部',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdSaleOfficeName"
              name="fdSaleOfficeName"
              label="销售部"
              @click="showSaleOfficeCode = true"
            />
          </block>

          <block theme="primary" title="客户信息">
            <van-field
              placeholder="请输入"
              required
              :rules="[
                {
                  required: true,
                  message: '请输入CPMS客户名称',
                  trriger: 'blur',
                },
              ]"
              v-model="formData.fdCpmsCustName"
              name="fdCpmsCustName"
              label="CPMS客户名称"
            />
            <van-field placeholder="请输入" v-model="formData.fdCustOrderNo" name="fdCustOrderNo" label="客户订单号" />
            <van-field placeholder="请输入" v-model="formData.fdInvoiceMsg" name="fdInvoiceMsg" label="开票信息" />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择要货客户',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdApplyCustomerName"
              name="fdApplyCustomerName"
              label="要货客户"
              @click="showApplyCustomerName = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择结算客户',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdSettleCustomerName"
              name="fdSettleCustomerName"
              label="结算客户"
              @click="showSettleCustomerName = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择配送客户',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdShipCustomerName"
              name="fdShipCustomerName"
              label="配送客户"
              @click="showShipCustomerName = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择业务员',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdSalesMan"
              name="fdSalesMan"
              label="业务员"
              @click="showSalesManId = true"
            />
          </block>

          <block theme="primary" title="配送信息">
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择配送方式',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdShipType"
              name="fdShipType"
              label="配送方式"
              @click="showShipType = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdShipType || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_order_ship_type"
                />
              </template>
            </van-field>

            <van-field
              readonly
              placeholder="请输入"
              v-model="formData.fdAddrDetail"
              name="fdAddrDetail"
              label="配送地址"
              required
              :rules="[
                {
                  required: true,
                  message: '请输入配送地址',
                  trriger: 'blur',
                },
              ]"
            />

            <van-field
              placeholder="请输入"
              v-model="formData.fdAddrContactName"
              name="fdAddrContactName"
              required
              :rules="[
                {
                  required: true,
                  message: '请输入收货人',
                  trriger: 'blur',
                },
              ]"
              label="收货人"
            />

            <van-field placeholder="请输入" v-model="formData.fdAddrMobile" name="fdAddrMobile" label="收货人电话" />
            <van-field
              v-if="formData.fdBillType === 'ELECTRONIC_SALES_ORDER'"
              placeholder="请输入"
              v-model="formData.fdAddrIdentityCode"
              name="fdAddrIdentityCode"
              label="收货人身份证"
            />

            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              v-model="formData.fdIsDistribution"
              name="fdIsDistribution"
              label="送装一体化"
              @click="showIsDistribution = true"
            />
          </block>

          <credit-info :crmCode="formData.fdApplyCustomerCode" :moduleId="id" @change="handleChangeCreditInfo" />

          <block theme="primary" title="附加信息">
            <van-field
              show-word-limit
              name="fdOrderRemark"
              v-model="formData.fdOrderRemark"
              rows="4"
              type="textarea"
              :maxlength="500"
              label="订单备注"
              placeholder="请输入"
            />
            <van-field
              readonly
              name="files"
              :value="(formData.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
              label="附件"
            >
              <uploader
                mode="file"
                slot="input"
                multiple
                :value="formData.sysAttContractAspectParams"
                @input="formData.sysAttContractAspectParams = $event"
              />
            </van-field>
          </block>
        </van-form>
      </div>
    </template>
    <template v-slot:footer="{ className }">
      <div :class="className">
        <van-button :loading="loading" block type="danger" @click="handleSubmit()"> 提交 </van-button>
      </div>
    </template>

    <selection-project
      searchable
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
      title="选择关联项目"
      @change="handleChangeProject"
      :visible.sync="showProject"
    />
    <selection-dict
      title="选择单据类型"
      systemCode="cpms"
      dictCode="cpms_order_bill_type"
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
      :visible.sync="showBillType"
    />
    <selection-corporate
      allow-clear
      title="选择分公司"
      placeholder="请选择"
      :value="
        !!formData.fdBranchCompanyName
          ? [
              {
                value: formData.fdBranchCompanyCode,
                text: formData.fdBranchCompanyName,
              },
            ]
          : []
      "
      @change="handleFdBranchCompanyCode"
      :visible.sync="showBranchCompanyCode"
    />
    <van-popup v-model="showBillCreateDate" position="bottom">
      <van-datetime-picker
        type="date"
        title="选择开单日期"
        @cancel="showBillCreateDate = false"
        @confirm="handleBillCreateDate"
        :min-date="minDate"
      />
    </van-popup>
    <selection-dict
      allow-clear
      title="选择所属行业"
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
      @change="handleBusiness"
      :visible.sync="showCorporateCode"
      searchable
    />

    <selection-sap-sale
      title="选择销售部"
      :sapCompanyCode="formData.fdBranchCompanyCode"
      :value="
        !!formData.fdSaleOfficeName
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
      :visible.sync="showSaleOfficeCode"
    />

    <selection-crm-customer
      title="选择要货客户"
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
      :visible.sync="showApplyCustomerName"
      @change="handleFdApplyCustomerName"
      :customerId="formData.fdCpmsCustId"
      :branchCode="formData.fdBranchCompanyCode"
      :deptCode="formData.fdSaleOfficeCode"
    />

    <selection-crm-customer
      title="选择结算客户"
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
      :visible.sync="showSettleCustomerName"
      @change="handleFdSettleCustomerName"
      :customerId="formData.fdCpmsCustId"
      :branchCode="formData.fdBranchCompanyCode"
      :deptCode="formData.fdSaleOfficeCode"
    />

    <selection-crm-customer
      title="选择配送客户"
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
      :visible.sync="showShipCustomerName"
      @change="handleFdShipCustomerName"
      :customerId="formData.fdCpmsCustId"
      :branchCode="formData.fdBranchCompanyCode"
      :deptCode="formData.fdSaleOfficeCode"
    />

    <selection-salesman-list
      :saleOfficeCode="formData.fdSaleOfficeCode"
      :value="
        !!formData.fdSalesMan
          ? [
              {
                value: formData.fdSalesManId,
                text: formData.fdSalesMan,
              },
            ]
          : []
      "
      :visible.sync="showSalesManId"
      @change="handleChangeFdSalesManId"
      placeholder="请选择"
      title="选择业务员"
      allow-clear
    />

    <selection-dict
      systemCode="cpms"
      dictCode="cpms_order_ship_type"
      placeholder="请选择"
      title="选择配送方式"
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
      :visible.sync="showShipType"
      @change="handleFdShipType"
    />

    <selection-yes-or-no
      placeholder="请选择"
      title="选择送装一体化"
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
      :visible.sync="showIsDistribution"
    />
  </list-layout>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import SelectionCorporate from '@/views/components/selection/corporate';
import SelectionCrmCustomer from '@/views/components/selection/crm-customer';
import SelectionProject from '@/views/components/selection/project';
import SelectionSalesmanList from '../components/selection/salesman-list';
import SelectionSapCompany from '@/views/components/selection/sap-company';
import SelectionSapSale from '@/views/components/selection/sap-sale';
import SelectionYesOrNo from '@/views/components/selection/yes-or-no';
import formMixin from './form';
import { formatMixin } from '@/mixins';
import CreditInfo from './credit-info';

export default {
  name: 'SalesOrderEdit',
  mixins: [formMixin, formatMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showProject: false,
      showBillType: false,
      showBranchCompanyCode: false,
      showSaleOfficeCode: false,
      showFirstSealCode: false,
      showCorporateCode: false,
      showSalesManId: false,
      showBusinessTypeCode: false,
      showContractTemplateCode: false,
      showContractTypeCode: false,
      showBillCreateDate: false,
      SalesManId: false,
      showShipType: false,
      showBusinessScopeCode: false,
      showApplyCustomerName: false,
      showSettleCustomerName: false,
      showShipCustomerName: false,
      showIsDistribution: false,
      minDate: new Date(),
    };
  },
  components: {
    SelectionCorporate,
    SelectionCrmCustomer,
    SelectionProject,
    SelectionSalesmanList,
    SelectionSapCompany,
    SelectionSapSale,
    SelectionYesOrNo,
    CreditInfo,
  },
  created() {
    this.initFormData(this.id);
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  methods: {
    //资信额度
    handleChangeCreditInfo(res) {
      console.log('资信额度', res);
      this.formData.orderCreditAddParams = res.orderCreditAddParams.map((d) => ({
        ...d,
        fdProductLineName: d.fdProductLineName,
        fdAvailableAmount: d.fdAvailableAmount,
        fdExpiationAmount: d.fdExpiationAmount,
        fdActualAccountPeriod: d.fdActualAccountPeriod,
        fdExpireDate: d.fdExpireDate,
      }));
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    onSubmit(action) {
      if (action !== 'draft' && (!!this.loading || !this.checkFormData(this.formData))) {
        return;
      }
      this.$dialog
        .confirm({
          title: `是否确认${action === 'draft' ? '暂存' : '提交'}表单?`,
        })
        .then(() => {
          this.submitFormData(this.formData, action);
        });
    },
    // 关联项目
    handleChangeProject(res) {
      this.loadProject((res[0] || {}).value);
    },
    handleFdBillType(res) {
      // console.log('单据类型', res);
      this.formData.fdBillType = (res[0] || {}).value;
    },
    // 所属行业
    handleBusiness(res) {
      this.formData.fdBusiness = (res[0] || {}).value;
    },
    // 开单日期
    handleBillCreateDate(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdBillCreateDate = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showBillCreateDate = false;
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
    // 要货客户
    async handleFdApplyCustomerName(res) {
      console.log('要货客户', res);
      this.formData.fdApplyCustomerName = (res[0] || {}).text;
      this.formData.fdApplyCustomerCode = (res[0] || {}).value;
      this.formData.fdSettleCustomerName = (res[0] || {}).text;
      this.formData.fdSettleCustomerCode = (res[0] || {}).value;
      this.formData.fdShipCustomerName = (res[0] || {}).text;
      this.formData.fdShipCustomerCode = (res[0] || {}).value;

      // 获取客户信息
      const findCrmParty = await api.order.getFindCrmParty({
        page: 1,
        size: 10,
        keyword: this.formData.fdApplyCustomerCode,
        // keyword: 'NNJTV.LZZB',
      });
      console.log('findCrmParty', findCrmParty);

      this.formData.fdSalesMan = (findCrmParty[0] || {}).salesmanName;
      this.formData.fdSalesManId = (findCrmParty[0] || {}).salesmanCode;
    },
    // 结算客户
    handleFdSettleCustomerName(res) {
      // console.log('结算客户', res);
      this.formData.fdSettleCustomerName = (res[0] || {}).text;
      this.formData.fdSettleCustomerCode = (res[0] || {}).value;
    },
    // 配送客户
    handleFdShipCustomerName(res) {
      // console.log('配送客户', res);
      this.formData.fdShipCustomerName = (res[0] || {}).text;
      this.formData.fdShipCustomerCode = (res[0] || {}).value;
    },
    // 业务员
    handleChangeFdSalesManId(res) {
      this.formData.fdSalesManId = (res[0] || {}).value;
      this.formData.fdSalesMan = (res[0] || {}).text;
    },
    // 配送方式
    handleFdShipType(res) {
      this.formData.fdShipType = (res[0] || {}).value;
    },
    // 送装一体化
    handleChangeIsDistribution(res) {
      // console.log('一体化', res);
      this.formData.fdIsDistribution = (res[0] || {}).text;
    },
  },
};
</script>

<style lang="scss" scoped></style>
