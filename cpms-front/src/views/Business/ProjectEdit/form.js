import dayjs from 'dayjs';
import api from '@/api';
import { userMixin, formatMixin } from '@/mixins';

export function getFormData() {
  return {
    fdName: '',
    fdProvince: '',
    fdCity: '',
    fdBusinessCenter: '',
    fdBusinessCenterCode: '',
    fdCompany: '',
    fdUse: '',
    fdProjectTypeId: '',
    fdProjectTypeName: '',
    fdTenderNum: '',
    fdBusinessCode: '',
    fdBusinessName: '',
    fdCorporateCode: '',
    fdCorporateName: '',
    fdAgencyCode: '',
    fdAgencyName: '',
    fdSuccessRate: '',
    fdEndTime: '',
    projectSites: [],
    fdProjectSum: 0,
    fdProjectDesc: '',
    fdProjectManner: '',
    fdCustMainId: '',
    fdCustName: '',
    fdSapCustCode: '',
    fdSapCustName: '',
    fdChannelOneCode: '',
    fdChannelOneName: '',
    fdChannelTwoCode: '',
    fdChannelTwoName: '',
    fdChannelThreeCode: '',
    fdChannelThreeName: '',
    fdTianyanchaMainId: '',
    fdTianyanchaName: '',
    fdLoginName: '',
    fdUserName: '',
    fdClueId: '',
    fdClueName: '',
    sysBusinessCenterPersonList: [],
    ccPersonPersonList: [],
    stakeholderListParams: [],
    addressListParams: [],
    productListParams: [],
    sysAttContractAspectParams: [],
    sysDatascopePersonAspectParams: [],
  };
}

export function getFormRules({}) {
  return {
    // fdName: [
    //   {
    //     required: true,
    //     message: "请输入项目名称",
    //     trigger: "change",
    //   },
    // ],
    fdUse: [
      {
        required: true,
        message: '请输入用途',
        trigger: 'blur',
      },
    ],
    fdProjectTypeId: [
      {
        required: true,
        message: '请选择项目类型',
        trigger: 'change',
      },
    ],
    fdBusinessCode: [
      {
        required: true,
        message: '请选择所属行业',
        trigger: 'change',
      },
    ],
    fdCorporateCode: [
      {
        required: true,
        message: '请选择分公司',
        trigger: 'change',
      },
    ],
    fdAgencyCode: [
      {
        required: true,
        message: '请选择业务单元',
        trigger: 'change',
      },
    ],
    fdBusinessCenter: [
      {
        required: true,
        message: '请选择商务中心',
        trigger: 'change',
      },
    ],
    fdSuccessRate: [
      {
        required: true,
        message: '请选择预计成交率',
        trigger: 'change',
      },
    ],
    fdEndTime: [
      {
        required: true,
        message: '请选择项目有效截止日期',
        trigger: 'change',
      },
    ],
    projectSites: [
      {
        required: true,
        message: '请选择项目所在地',
        trigger: 'change',
      },
    ],
    fdProjectDesc: [
      {
        required: true,
        message: '请输入项目情况简介',
        trigger: 'blur',
      },
    ],
    fdProjectManner: [
      {
        required: true,
        message: '请选择项目方式',
        trigger: 'change',
      },
    ],
    fdCustName: [
      {
        required: true,
        message: '请选择客户/代理商',
        trigger: 'change',
      },
    ],
    fdTianyanchaName: [
      {
        required: true,
        message: '请输入终端客户名称',
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
    sysBusinessCenterPersonList: [
      {
        required: true,
        message: '请选择商务中心工程接口人',
        trigger: 'change',
      },
    ],
  };
}

export default {
  mixins: [userMixin, formatMixin],
  data() {
    return {
      loading: false,
      formData: getFormData(),
      attKey: 'PROJECT_MAIN',
      isChangeProjectSites: false,
      allowChangeBusiness: true,
    };
  },
  computed: {
    projectName() {
      return this.getProjectName(this.formData);
    },
    formRules() {
      return getFormRules({});
    },
    fdProjectSum() {
      const { productListParams = [] } = this.formData;

      return (productListParams || [])
        .filter((d) => d.fdIsValid !== '0')
        .reduce((p, c) => p + (Number(c.fdTotalSum) || 0), 0);
    },
  },
  methods: {
    handleCancel() {
      this.$router.back(true);
    },
    handleCreate(query = {}) {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query,
      });
    },
    handleTransferOrder(targetName, targetId) {
      setTimeout(() => {
        this.$router.push({
          path: `/Order/SalesOrderCreate`,
          query: {
            source: 'project',
            targetName: targetName,
            targetId: targetId,
          },
        });
      }, 300);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Business/ProjectEdit/${id}`,
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Business/ProjectDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;
      try {
        if (!!id) {
          const data = await api.business.getProjectDetail(id);

          const fileList = await api.common
            .getFileList({
              attKey: this.attKey,
              moudleId: id,
            })
            .then((res) => res.data || []);

          this.formData = {
            ...this.formData,
            ...data,
            projectSites: data.projectSiteListDtoList || [],
            stakeholderListParams: data.stakeholderListDtoList || [],
            addressListParams: data.addressListDtoList || [],
            productListParams: (data.projectProductListDtoList || []).map((d) => ({
              ...d,
              fdShippingDate: this.formatDate(d.fdShippingDate),
            })),
            sysAttContractAspectParams: fileList.map((d) => ({
              text: d.fdFileName,
              value: d.id,
              path: d.fdPath,
            })),
            sysDatascopePersonAspectParams: data.sysDatascopePersonDtoList || [],
            sysBusinessCenterPersonList: data.sysBusinessCenterPersonList || [],
            ccPersonPersonList: data.ccPersonPersonList || [],
            fdEndTime: !!data.fdEndTime
              ? dayjs(new Date(data.fdEndTime)).format('YYYY-MM-DD')
              : data.fdEndTime,
          };
        } else {
          const { projectTypeId, projectTypeName, source, targetId } = this.$route.query;

          this.formData = {
            ...this.formData,
            fdProjectTypeId: projectTypeId,
            fdProjectTypeName: projectTypeName,
            fdUserName: this.user.name,
            fdLoginName: this.user.uid,
            fdAgencyCode: '90009555/dz90009555',
            fdAgencyName: 'B2B业务中心',
          };

          const businessCenter = await api.business.getBusinessCenter();
          if (businessCenter.fdBusinessCenter && businessCenter.fdBusinessCenterCode) {
            if (businessCenter.fdBusinessCenter.indexOf('商务中心') > -1) {
              this.allowChangeBusiness = false;
            }

            this.formData = {
              ...this.formData,
              fdBusinessCenter: businessCenter.fdBusinessCenter,
              fdBusinessCenterCode: businessCenter.fdBusinessCenterCode,
            };
          }

          if (!!source && !!targetId) {
            if (source === 'customer') {
              const customerData = (await api.customer.getCustomerDetail(targetId)) || {};

              if (customerData.fdCustType === 'agent') {
                this.formData.fdProjectManner = '代理商操作';
              } else {
                this.formData.fdProjectManner = '客户直投';
              }

              this.formData.fdBusinessCode = customerData.fdCustIndustry;
              this.formData.fdCustName = customerData.fdCustName;
              this.formData.fdCustMainId = targetId;
            }

            if (source === 'clue') {
              const clueData = await api.clue.getClueDetail(targetId);
              this.formData.fdClueId = targetId;
              this.formData.fdClueName = clueData.fdClueName;
              // this.formData.fdCustName = clueData.fdCustName;
              // this.formData.fdCustMainId = clueData.fdCustMainId;
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async loadCRMInfo(company, customerId) {
      const cleanSap = () => {
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
        this.formData.fdChannelOneName = '';
        this.formData.fdChannelOneCode = '';
        this.formData.fdChannelTwoName = '';
        this.formData.fdChannelTwoCode = '';
      };

      if (!company || !customerId) {
        cleanSap();
        return;
      }

      const crms = await api.price.getCrmCust({
        fdBranchCompanyCode: company || '',
        fdCustMainId: customerId || '',
      });

      const crm = crms[0];
      if (crm) {
        this.formData.fdSapCustName = crm.fdSapCustName;
        this.formData.fdSapCustCode = crm.fdSapCustCode;
        this.formData.fdChannelOneName = crm.fdChannelOneName;
        this.formData.fdChannelOneCode = crm.fdChannelOneCode;
        this.formData.fdChannelTwoName = crm.fdChannelTwoName;
        this.formData.fdChannelTwoCode = crm.fdChannelTwoCode;
      } else {
        cleanSap();
      }
    },

    getProjectName(formData) {
      const { projectSites = [], fdProjectManner } = formData;

      const mainSite = projectSites.find((d) => d.fdIsMain === '1') || {};

      let custName = '';
      if (fdProjectManner === '客户直投') {
        custName = formData.fdCustName;
      } else {
        custName = formData.fdTianyanchaName;
      }

      if (
        !formData.fdBusinessCenter ||
        !mainSite.fdProvinceName ||
        !mainSite.fdCityName ||
        !custName ||
        !formData.fdUse
      ) {
        return '';
      }

      return `${formData.fdBusinessCenter || '-'}关于${custName || '-'}${
        mainSite.fdProvinceName || '-'
      }${mainSite.fdCityName || '-'}${formData.fdUse || '-'}的项目报备`;
    },

    async submitFormData(formData, action) {
      this.loading = true;

      const { projectSites = [] } = formData;

      const mainSite = projectSites.find((d) => d.fdIsMain === '1') || {};

      // 项目所在地可以只有一条，此外，如果只有一个项目所在地时，提交时，将其默认为主项目所在地
      // if (projectSites.length === 1) {
      //   projectSites[0].fdIsMain = "1";
      // }

      try {
        formData = {
          ...formData,
          fdName: this.getProjectName(formData),
          sysAttContractAspectParams: formData.sysAttContractAspectParams.map((d) => ({
            fdAttKey: this.attKey,
            fdAttFileId: d.value,
          })),
          fdProvince: mainSite.fdProvince,
          fdCity: mainSite.fdCity,
          fdAttKey: this.attKey,
          fdProjectSum: this.fdProjectSum,
          sysDatascopePersonDtoList: formData.sysDatascopePersonAspectParams,
          projectProductListDtoList: formData.productListParams,
          addressListDtoList: formData.addressListParams,
          stakeholderListDtoList: formData.stakeholderListParams,
          projectSiteListDtoList: formData.projectSites,
        };

        const goBack = () => {
          setTimeout(() => {
            this.$router.back(true);
          }, 300);
        };

        switch (action) {
          case 'draft':
            await api.business.postProjectForm({
              ...formData,
              mainId: formData.id,
              fdProjectStatus: 'draft',
            });
            this.$message.success('表单暂存成功');
            goBack();
            break;
          case 'add':
          case 'edit':
            const checkProject = await api.business
              .getProjectCheckList({
                fdName: formData.fdName,
                fdIsPrompt: '1',
                id: formData.id,
              })
              .then((res) => res.data[0]);

            const submit = async (otherForm = {}) => {
              if (action === 'add') {
                await api.business.postProjectForm({
                  ...formData,
                  ...otherForm,
                  fdProjectStatus: 'todo',
                });
              } else if (action === 'edit') {
                await api.business.putProjectForm({
                  ...formData,
                  ...otherForm,
                  fdProjectStatus:
                    formData.fdProjectStatus === 'draft'
                      ? 'todo'
                      : formData.fdProjectStatus,
                  isChangeProjectSites: this.isChangeProjectSites ? '1' : undefined,
                });
              }

              this.$message.success('表单提交成功');
              goBack();
            };

            if (!!checkProject) {
              this.$confirm({
                title: `${checkProject.fdRepeatPrompt}，是否还要提交?`,
                onOk: async () => {
                  this.loading = true;
                  try {
                    await submit({
                      fdRepeatPrompt: checkProject.fdRepeatPrompt,
                    });
                  } finally {
                    this.loading = false;
                  }
                },
                onCancel: () => {},
              });
            } else {
              await submit();
            }
            break;
          default:
            break;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    checkFormData(formData) {
      const {
        addressListParams = [],
        stakeholderListParams = [],
        productListParams = [],
        projectSites = [],
      } = formData;

      if (addressListParams.length <= 0) {
        this.$message.error('项目施工地址不能为空');
        return false;
      }

      if (stakeholderListParams.length <= 0) {
        this.$message.error('项目干系人不能为空');
        return false;
      }

      if (productListParams.length <= 0) {
        this.$message.error('产品信息不能为空');
        return false;
      }

      if (!productListParams.every((d) => d.fdNum > 0)) {
        this.$message.error('产品信息中数量不能小于等于0');
        return false;
      }

      if (projectSites.length <= 0) {
        this.$message.error('项目所在地不能为空');
        return false;
      }

      if (projectSites.filter((d) => d.fdIsMain === '1').length !== 1) {
        this.$message.error('项目所在地校验失败，有且只能有一条主所在地数据');
        return false;
      }

      const otherSites = projectSites.filter((d) => d.fdIsMain !== '1');

      if (otherSites.find((d) => d.fdEntireCountry === '1') && otherSites.length > 1) {
        this.$message.error('项目所在地校验失败，已选择全国，无法再选择非全国的所在地');
        return false;
      }

      if (
        !projectSites.every((d, i) => {
          return (
            i ===
            projectSites.findIndex((_d) => {
              return (
                d.fdIsMain === _d.fdIsMain &&
                d.fdEntireCountry === _d.fdEntireCountry &&
                d.fdProvince === _d.fdProvince &&
                d.fdCity === _d.fdCity
              );
            })
          );
        })
      ) {
        this.$message.error('项目所在地校验失败，存在重复地址');
        return false;
      }

      return true;
    },
  },
};
