import api from '@/api';
import dayjs from 'dayjs';
import { userMixin } from '@/mixins';

function getFormData() {
  return {
    fdTitle: '', //标题
    fdUserName: '', //业务员姓名
    // fdLoginName: 'chenyj', //业务员登录名
    fdLoginName: '', //业务员登录名
    fdReqUser: '', //申请人
    fdReqDept: '', //申请人部门
    fdDeptCode: '', //申请人部门code
    fdMaintainType: '', //维护类型
    fdCreateTime: '', //创建时间

    fdSapCustName: '', //客户名称
    fdCustMainId: '', //意向客户id
    fdSapUnifiedCode: '', //增值税登记号（社会统一信用代码）
    fdSapCustName2: '', //客户名称2
    fdSapShortName: '', //客户简称
    fdSapAccountGroup: '', //客户账户组
    fdSapAccountGroupCode: '',
    fdSapCountry: '', //国家
    fdSapCountryCode: '', //国家code
    fdSapProvince: '', //省
    fdSapProvinceCode: '', //省code
    fdSapCity: '', //市
    fdSapCityCode: '', //市code
    fdSapCounty: '', //县
    fdSapCountyCode: '', //县code
    fdSapTowns: '', //乡镇
    fdSapTownsCode: '', //乡镇code

    fdSapAddress: '', //客户地址
    fdSapContact: '', //联系人
    fdSapMobile: '', //手机号码
    fdSapPhone: '', //固话
    fdSapMail: '', //客户邮箱
    fdShopLevel: '', //CRM门店市场级别
    fdShopLevelCode: '', //CRM门店市场级别code
    fdShopType: '', //CRM门店分级
    fdShopTypeCode: '', //CRM门店分级code
    fdAgent: '', //是否代理商
    fdSapStatus: '', //客户状态
    fdDataGenerateMode: '', //
    fdIncoTerm: 'CPM', //国际贸易条件

    custSapCompanyListAddParamList: [], //公司视图
    custSapSaleListAddParamList: [], //销售视图
    custSapBankListAddParamList: [], //银行信息
    sysAttContractAspectParams: [], //附件

    fdEnterpriseId: '',
  };
}

function getFormRules({}) {
  return {
    fdTitle: [
      {
        required: true,
        message: '请输入标题',
        trigger: 'blur',
      },
    ],
    fdReqUser: [
      {
        required: true,
        message: '请输入申请人',
        trigger: 'blur',
      },
    ],
    sysDatascopeDeptAspectParams: [
      {
        required: true,
        message: '请选择部门',
        trigger: 'blur',
      },
    ],
    fdMaintainType: [
      {
        required: true,
        message: '请选择维护类型',
        trigger: 'blur',
      },
    ],
    // fdCreateTime: [{
    //   required: true,
    //   message: '请输入创建日期',
    //   trigger: 'blur',
    // }],
    fdSapCustName: [
      {
        required: true,
        message: '请输入客户名称',
        trigger: 'blur',
      },
    ],
    fdSapUnifiedCode: [
      {
        required: true,
        message: '请输入统一社会信用代码',
        trigger: 'blur',
      },
    ],
    fdSapShortName: [
      {
        required: true,
        message: '请输入客户简称',
        trigger: 'blur',
      },
    ],
    fdSapAccountGroup: [
      {
        required: true,
        message: '请选择客户账户组',
        trigger: 'change',
      },
    ],
    fdSapCountry: [
      {
        required: true,
        message: '请选择国家',
        trigger: 'change',
      },
    ],
    fdSapProvinceCode: [
      {
        required: true,
        message: '请选择省份',
        trigger: 'change',
      },
    ],
    fdSapCityCode: [
      {
        required: true,
        message: '请选择城市',
        trigger: 'change',
      },
    ],
    fdSapCountyCode: [
      {
        required: true,
        message: '请选择县区',
        trigger: 'change',
      },
    ],
  };
}

export default {
  mixins: [userMixin],
  data() {
    return {
      loading: false,
      category: [],
      attKey: 'CUSTOMER_LICENSE',
      formData: getFormData(),
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
  },
  methods: {
    handleEdit(id) {
      this.$router.push({
        path: `/Customer/SAPCustomerEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Customer/SAPCustomerCreate',
      });
    },
    handleDeatil(id) {
      this.$router.push({
        path: `/Customer/SAPCustomerDetail/${id}`,
      });
    },
    handleCancel() {
      this.$router.back(true);
    },
    handCompanyCode(value) {
      this.formData.custSapSaleListAddParamList = [];
      // this.formData.custSapCompanyListAddParamList = [...value.contactAddParamList];
    },
    handSalesView(value) {
      // 国际贸易条件2  传统一社会信用代码  无统一社会信用代码情况设定为 '000000000000000' fdDataGenerateMode normal_code manual
      value.custSapSaleListAddParamList = value.custSapSaleListAddParamList.map((d) => ({
        ...d,
        // fdDistributionChannel: this.formData.fdDistributionChannel, //分销渠道
        fdDistributionChannelCode: this.formData.fdDistributionChannelCode, //分销渠道code
        fdDivision: this.formData.fdDivision, //产品组
        fdDivisionCode: this.formData.fdDivisionCode, //产品组code
        fdIncoTerm: this.formData.fdIncoTerm, //国际贸易条件
        fdIncoTerm2: this.formData.fdSapUnifiedCode, //国际贸易条件2
      }));
      this.formData.custSapSaleListAddParamList = [...value.custSapSaleListAddParamList];
    },
    handBankAccount(value) {},
    async initFormData(id) {
      this.loading = true;
      try {
        if (!!id) {
          //有id 编辑
          const data = await api.customer.getCustSapMain(id);

          this.formData = {
            ...this.formData,
            ...data,
            fdCreateTime: !!data.fdCreateTime
              ? dayjs(new Date(data.fdCreateTime)).format('YYYY-MM-DD')
              : '', //创建时间
            custSapCompanyListAddParamList: data.custSapCompanyListDtos || [], //公司视图
            custSapSaleListAddParamList: data.custSapSaleListDtos || [], //销售视图
            custSapBankListAddParamList: data.custSapBankListDtos || [], //银行信息
          };
          const attr = await api.common
            .getFileList({
              attKey: this.attKey,
              moudleId: id,
            })
            .then((res) => res.data);
          this.formData.sysAttContractAspectParams = attr.map((d) => ({
            value: d.id,
            text: d.fdFileName,
            path: d.fdPath,
          }));
        } else {
          //没id 新增 或者 意向客户转正式的新增
          if (!!this.fdCustMainId) {
            this.formData.fdCustMainId = this.fdCustMainId;
            this.getCustInfo(this.fdCustMainId);
          }
          // TODO 新建初始化数据
          this.formData = {
            ...this.formData,
            fdCreateTime: dayjs(new Date()).format('YYYY-MM-DD'),
            fdSapCountry: '中国',
            fdSapCountryCode: 'CN',
            fdMaintainType: '001',
            fdSapAccountGroup: '非关联方代码',
            fdSapAccountGroupCode: 'Z011',
            fdUserName: this.user.name,
            fdLoginName: this.user.uid,
            fdReqUser: this.user.name,
          };
        }
        const distributionChannelList = await api.customer.getDistributionChannel();
        const productGroupList = await api.customer.getProductGroupList();
        const termsTrade = await api.customer.getTermsTrade();
        this.formData = {
          ...this.formData,
          fdReqDept: (this.user.userInfo.orgPosDtos[0] || {}).orgName, //申请人部门
          fdDeptCode: (this.user.userInfo.orgPosDtos[0] || {}).orgCode, //申请人部门code
          fdDistributionChannel: (distributionChannelList.data[0] || {}).text, //分销渠道
          fdDistributionChannelCode: (distributionChannelList.data[0] || {}).value, //分销渠道code
          fdDivision: (productGroupList.data[0] || {}).text, //产品组
          fdDivisionCode: (productGroupList.data[0] || {}).value, //产品组code
          // fdIncoTerm: (termsTrade.data[0] || {}).value, //国际贸易条件
          fdIncoTerm: 'CPM', //国际贸易条件
        };
      } finally {
        this.loading = false;
      }
    },

    async submitFormData(formData, action) {
      this.loading = true;
      formData = {
        ...formData,
        fdAttKey: this.attKey,
        sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
          fdAttFileId: d.value,
          fdAttKey: this.attKey,
        })),
      };
      if (formData.fdSapUnifiedCode.slice(0, 10) === 'TIANYANCHA') {
        formData.fdSapUnifiedCode = '000000000000000';
      }
      // formData = {
      //   ...formData,
      //   fdReqDept: formData.fdReqDept ? formData.fdReqDept[0].code : '',
      // };
      try {
        if (
          !!this.id &&
          formData.fdSapStatus !== 'reject' &&
          action !== 'draft' &&
          formData.fdSapStatus !== 'draft'
        ) {
          // 编辑的情况下提交
          formData = JSON.parse(
            JSON.stringify(formData).replace(
              /contactAddParamList/g,
              'contactEditParamList'
            )
          );
          formData = JSON.parse(
            JSON.stringify(formData).replace(
              /addressAddParamList/g,
              'addressEditParamList'
            )
          );
          formData = JSON.parse(
            JSON.stringify(formData).replace(/custMainAddParam/g, 'custMainEditParam')
          );
        }
        switch (action) {
          case 'draft':
            formData.fdSapStatus = 'draft';
            await api.customer.postCreateSAPCustomer(formData);
            break;
          case 'add':
            formData.fdSapStatus = 'todo';
            await api.customer.postCreateSAPCustomer(formData);
            break;
          case 'edit':
            if (formData.fdSapStatus === 'draft' || formData.fdSapStatus === 'reject') {
              formData.fdSapStatus = 'todo';
              await api.customer.postCreateSAPCustomer(formData);
            } else {
              await api.customer.putEditCustomer(formData);
            }
            break;
          default:
            break;
        }

        this.$message.success('表单' + (action === 'draft' ? '暂存' : '提交') + '成功');

        setTimeout(() => {
          this.$router.back(true);
        }, 300);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    checkFormData(formData) {
      const { custSapSaleListAddParamList, custSapCompanyListAddParamList } = formData;

      if (
        !!formData.fdSapMail &&
        !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formData.fdSapMail)
      ) {
        this.$message.error('客户邮箱格式错误');
        return true;
      }

      if (custSapCompanyListAddParamList.length < 1) {
        this.$message.error('公司代码视图不能为空');
        return true;
      }

      if (custSapSaleListAddParamList.length < 1) {
        this.$message.error('销售视图不能为空');
        return true;
      }

      if (
        custSapCompanyListAddParamList.filter(
          (d, i) =>
            custSapCompanyListAddParamList.findIndex(
              (_d) => _d.fdCompanySapCode === d.fdCompanySapCode
            ) !== i
        ).length > 0
      ) {
        this.$message.error('公司代码不允许重复选择');
        return true;
      }

      if (
        custSapSaleListAddParamList.filter(
          (d, i) =>
            custSapSaleListAddParamList.findIndex(
              (_d) =>
                _d.fdSalesOrganizationCode === d.fdSalesOrganizationCode &&
                _d.fdSalesOfficeCode === d.fdSalesOfficeCode &&
                _d.fdMarketLevelCode === d.fdMarketLevelCode &&
                _d.fdChannelOneCode === d.fdChannelOneCode &&
                _d.fdChannelTwoCode === d.fdChannelTwoCode &&
                _d.fdChannelThreeCode === d.fdChannelThreeCode &&
                _d.fdSalesManCode === d.fdSalesManCode
            ) !== i
        ).length > 0
      ) {
        this.$message.error('销售视图不允许重复提交');
        return true;
      }
      return false;
    },
  },
};
