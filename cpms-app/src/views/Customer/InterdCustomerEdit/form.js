import api from '@/api';
import dayjs from 'dayjs';
import { userMixin } from '@/mixins';

function getFormData() {
  return {
    fdCustName: '',
    fdUnifiedCode: '',
    fdEnterpriseId: '',
    fdCustType: '',
    fdCustIndustry: '',
    fdCompanyType: '',
    fdCustManageforms: '',
    fdCompanyRegassets: '',
    fdTotalCount: '',
    fdCompanyRegtime: '',
    fdRegLocation: '',
    fdCountry: 'CN',
    fdProvince: '',
    fdProvinceCode: '',
    fdCity: '',
    fdCityCode: '',
    fdIsDiscern: '',
    fdPurchaseAmount: '',
    fdSalesVolumeint: '',
    fdCustSource: '',
    fdChannel: '',
    fdCustProfile: '',
    fdLoginName: '',
    fdUserName: '',
    fdAgentName: '',
    fdAgentId: '',
    fdIsAgent: '',
    contactAddParamList: [],
    addressAddParamList: [],
    sysAttContractAspectParams: [],
    sysDatascopePersonAspectParams: [],
    sysDatascopeDeptAspectParams: [],
  };
}

function getFormRules({}) {
  return {
    fdCustName: [
      {
        required: true,
        message: '请输入客户名称',
        trigger: 'blur',
      },
    ],
    fdUnifiedCode: [
      {
        required: true,
        message: '请输入统一社会信用代码',
        trigger: 'blur',
      },
    ],
    fdCustType: [
      {
        required: true,
        message: '请选择客户类型',
        trigger: 'change',
      },
    ],
    fdCustIndustry: [
      {
        required: true,
        message: '请选择所属行业',
        trigger: 'change',
      },
    ],
    fdRegLocation: [
      {
        required: true,
        message: '请输入注册地址',
        trigger: 'blur',
      },
    ],
    fdProvince: [
      {
        required: true,
        message: '请输入注册省份',
        trigger: 'blur',
      },
    ],
    fdCity: [
      {
        required: true,
        message: '请输入注册城市',
        trigger: 'blur',
      },
    ],
    fdChannel: [
      {
        required: true,
        message: '请选择渠道信息',
        trigger: 'change',
      },
    ],
    fdCustProfile: [
      {
        required: true,
        message: '请输入客户情况简介',
        trigger: 'blur',
      },
    ],
    fdLoginName: [
      {
        required: true,
        message: '请选择关联业务员',
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
      source: '',
      type: '',
      customerIdentification: 'cust',
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
  },
  methods: {
    handleDetail(id, type) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${id}`,
        query: {
          type: type,
        },
      });
    },
    handleEdit(id, type) {
      this.$router.push({
        path: `/Customer/InterdCustomerEdit/${id}`,
        query: {
          type: type,
        },
      });
    },
    handleCancel(needConfirm) {
      if (needConfirm === true) {
        this.$dialog
          .confirm({
            title: '当前内容未保存，是否确认返回?',
          })
          .then(() => {
            //退出
            this.$root.goBack();
          });
      } else {
        this.$root.goBack();
      }
    },
    handleCreate() {
      this.$router.push({
        path: '/Customer/InterdCustomerCreate',
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          if (this.type === 'invalid') {
            const data = await api.customer.getValidCustomerDetail(id);
            this.getCommonDetail(data);
          } else {
            const data = await api.customer.getCustomerDetail(id);
            this.getCommonDetail(data);
          }
          // 获取营业执照
          const attr = await api.common.getFileList({
            attKey: this.attKey,
            moudleId: id,
          });
          this.formData = {
            ...this.formData,
            sysAttContractAspectParams: attr.data.map((d) => ({
              value: d.id,
              text: d.fdFileName,
              path: d.fdPath,
            })),
          };
        } else {
          // TODO 新建初始化数据
          this.formData = {
            ...this.formData,
            fdUserName: this.user.name,
            fdLoginName: this.user.uid,
            sysDatascopePersonAspectParams: [
              {
                // 此处与pc有出入
                value: this.user.uid,
                text: this.user.name,
              },
            ],
          };

          if (this.source === 'clue') {
            const data = await api.clue.getClueDetail(this.targetId);
            const { fdClientUnifiedCode } = data;

            if (!!fdClientUnifiedCode) {
              const res = await api.customer.getCustomerTianyanchaInfo(fdClientUnifiedCode);
              this.formData = {
                ...this.formData,
                fdClueId: this.targetId,
                fdCustName: res.data.fdName,
                fdUnifiedCode: res.data.fdCreditCode,
                fdCompanyType: res.data.fdCompanyOrgType,
                fdCompanyRegassets: res.data.fdRegCapital,
                fdCustManageforms: res.data.fdRegStatus,
                fdTotalCount: res.data.fdStaffNumRange,
                fdCompanyRegtime: res.data.fdEstiblishTime
                  ? dayjs(new Date(res.data.fdEstiblishTime)).format('YYYY-MM-DD')
                  : res.data.fdEstiblishTime,
                fdRegLocation: res.data.fdRegLocation,
              };

              const result = await api.customer.postAddressTranslation({
                cityName: res.data.fdCity,
              });
              if (result.cityName === null) {
                this.formData = {
                  ...this.formData,
                  fdIsDiscern: '0', //是否识别注册地址
                  fdProvince: '',
                  fdCity: '',
                };
              } else {
                this.formData = {
                  ...this.formData,
                  fdIsDiscern: '1',
                  fdProvince: result.provinceName,
                  fdCity: result.cityName,
                };
              }
            }
          }
        }
      } finally {
        this.loading = false;
      }
    },
    getCommonDetail(data) {
      this.formData = {
        ...data,
        fdCompanyRegtime: !!data.fdCompanyRegtime ? dayjs(new Date(data.fdCompanyRegtime)).format('YYYY-MM-DD') : '',
        contactAddParamList: data.contactDtoList || [],
        addressAddParamList: data.addressDtoList || [],
        sysDatascopePersonAspectParams:
          data.sysDatascopePersonAspectParams.length > 0
            ? data.sysDatascopePersonAspectParams.map((d) => ({
                // 此处与pc有出入
                value: d.fdPersonId,
                text: d.fdPersonName,
              }))
            : [],
        sysDatascopeDeptAspectParams:
          data.sysDatascopeDeptAspectParams.length > 0
            ? data.sysDatascopeDeptAspectParams.map((d) => ({
                // 此处与pc有出入
                value: d.fdDeptId,
                text: d.fdDeptName,
              }))
            : [],
      };
    },
    handContact(value) {
      this.formData.contactAddParamList = [...value.contactAddParamList];
    },
    handAddressList(value) {
      this.formData.addressAddParamList = [...value.addressAddParamList];
    },

    async submitFormData(formData, action) {
      this.loading = true;

      try {
        formData = {
          ...formData,
          attKey: this.attKey,
          sysAttContractAspectParams: formData.sysAttContractAspectParams.map((d) => ({
            fdAttFileId: d.value,
            fdAttKey: this.attKey,
          })),
          sysDatascopePersonAspectParams: formData.sysDatascopePersonAspectParams.map((d, index) => ({
            fdFieldFlag: this.customerIdentification,
            fdOrderBy: index,
            // 此处与pc有出入
            fdPersonId: d.value,
            fdPersonName: d.text,
          })),
          sysDatascopeDeptAspectParams: formData.sysDatascopeDeptAspectParams.map((d, index) => ({
            fdFieldFlag: this.customerIdentification,
            fdOrderBy: index,
            fdDeptId: d.value,
            fdDeptName: d.text,
          })),
        };

        formData.custMainAddParam = {
          ...formData,
        };

        if (!!this.id && formData.fdStatus !== 'reject' && action !== 'draft' && formData.fdStatus !== 'draft') {
          // 编辑的情况下提交
          formData = JSON.parse(JSON.stringify(formData).replace(/contactAddParamList/g, 'contactEditParamList'));
          formData = JSON.parse(JSON.stringify(formData).replace(/addressAddParamList/g, 'addressEditParamList'));
          formData = JSON.parse(JSON.stringify(formData).replace(/custMainAddParam/g, 'custMainEditParam'));
        }

        switch (action) {
          case 'draft':
            formData.custMainAddParam.fdStatus = 'draft';
            await api.customer.postCreateCustomer(formData);
            break;
          case 'add':
            formData.custMainAddParam.fdStatus = 'todo';
            await api.customer.postCreateCustomer(formData);
            break;
          case 'edit':
            if (formData.fdStatus === 'draft' || formData.fdStatus === 'reject') {
              formData.custMainAddParam.fdStatus = 'todo';
              await api.customer.postCreateCustomer(formData);
            } else {
              await api.customer.putEditCustomer(formData);
            }
            break;
          default:
            break;
        }

        this.$toast.success('表单' + (action === 'draft' ? '暂存' : '提交') + '成功');

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
      const { addressAddParamList = [] } = formData;

      if (addressAddParamList.length <= 0) {
        this.$toast('客户办公地址不能为空');
        return false;
      }

      return true;
    },
  },
};
