import api from '@/api';
import { userMixin, formatMixin } from '@/mixins';
import dayjs from 'dayjs';

function getFormData() {
  return {
    version: 0,
    fdProjectMainName: '',
    fdProjectMainId: '',
    fdCustMainId: '',
    fdCustName: '',
    fdFirstSealCode: '',
    fdQuantityParty: '',
    fdQuantityWe: '',
    fdCorporateCode: '',
    fdCorporateName: '',
    fdSealTypeCode: '',
    fdBusinessTypeCode: '',
    fdContractTemplateCode: '',
    fdContractTypeCode: '',
    fdContractTypeName: '',
    fdTermContractPrice: 0,
    fdPriceZeroReason: '',
    fdPartyFullName: '',
    fdContractTitle: '',
    fdContentDescribe: '',
    fdSapCustName: '',
    fdSapCustCode: '',
    fdBusinessScopeCode: '',
    fdBeginTime: '',
    fdEndTime: '',
    fdStatus: 'todo',
    fdLoginName: '',
    fdUserName: '',
    contractPriceAddParamLists: [],
    sysAttContractAspectParams: [],
    contractInstallAddParamLists: [
      {
        fdAmount: 0,
        fdCostBearName: '',
        fdCostBearCode: '',
        fdInstallExplain: '',
        sysAttContractAspectParams: [],
      },
    ],
    contractTransportAddParamLists: [
      {
        fdAmount: 0,
        fdCostBearName: '',
        fdCostBearCode: '',
        fdFloor: '',
        fdIsElevator: 0,
        fdIsGoUpstairs: 0,
        fdIsTclInstall: 0,
        fdPaymentTypeCode: '',
        fdPaymentTypeName: '',
        fdTransportTypeCode: '',
        fdPaymentTypeName: '',
      },
    ],
    fdLeaderList: [],
    fdOtherList: [],
    fdManagerList: [],
  };
}

function getFormRules({ fdTermContractPrice }) {
  return {
    fdProjectMainName: [
      {
        required: true,
        message: '请选择项目名称',
        trigger: 'change',
      },
    ],
    fdSapCustName: [
      {
        required: true,
        message: '请输入CRM客户名称',
        trigger: 'blur',
      },
    ],
    fdFirstSealCode: [
      {
        required: true,
        message: '请选择先行盖章方',
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
    fdSealTypeCode: [
      {
        required: true,
        message: '请选择印章类型',
        trigger: 'change',
      },
    ],
    fdBusinessTypeCode: [
      {
        required: true,
        message: '请选择事务类别',
        trigger: 'change',
      },
    ],
    fdContractTemplateCode: [
      {
        required: true,
        message: '请选择合同模板',
        trigger: 'change',
      },
    ],
    fdContractTypeCode: [
      {
        required: true,
        message: '请选择合同类别',
        trigger: 'change',
      },
    ],
    fdBeginTime: [
      {
        required: true,
        message: '请选择合同开始时间',
        trigger: 'change',
      },
    ],
    fdEndTime: [
      {
        required: true,
        message: '请选择合同截止时间',
        trigger: 'change',
      },
    ],
    fdTermContractPrice: [
      {
        required: true,
        message: '请输入期限内合同金额(元)',
        trigger: 'blur',
      },
    ],
    fdPriceZeroReason: [
      {
        required: fdTermContractPrice === 0 || fdTermContractPrice === '' ? true : false,
        message: '请输入金额为0理由',
        trigger: 'blur',
      },
    ],
    fdPartyFullName: [
      {
        required: true,
        message: '请输入合同相对方全称',
        trigger: 'blur',
      },
    ],
    fdBusinessScopeCode: [
      {
        required: true,
        message: '请选择业务范畴',
        trigger: 'change',
      },
    ],
    fdContractTitle: [
      {
        required: true,
        message: '请输入合同附件主题',
        trigger: 'blur',
      },
    ],
    fdContentDescribe: [
      {
        required: true,
        message: '请输入合同内容概述',
        trigger: 'blur',
      },
    ],
    fdLeaderList: [
      {
        required: true,
        message: '请选择直接/分部领导',
        trigger: 'change',
      },
    ],
    fdManagerList: [
      {
        required: true,
        message: '请选择一级部门负责人/商总',
        trigger: 'change',
      },
    ],
    // fdOtherList: [
    //   {
    //     required: true,
    //     message: '请选择其他相关领导',
    //     trigger: 'change'
    //   }
    // ],
    sysAttContractAspectParams: [
      {
        required: true,
        message: '请上传合同附件',
        trigger: 'change',
      },
    ],
  };
}

export default {
  mixins: [userMixin, formatMixin],
  data() {
    const { source, targetId } = this.$route.query;
    return {
      loading: false,
      attKey: 'CONTRACT_FILE',
      installAttKey: 'CONTRACT_INSTALL_FILE',
      formData: getFormData(),
      source,
      targetId,
    };
  },
  computed: {
    formRules() {
      return getFormRules(this.formData);
    },
  },
  methods: {
    // 跳转新增页
    handleCreate() {
      this.$router.push({
        path: '/Business/Contract/ContractCreate',
      });
    },
    // 跳转详情页
    handleDetail(id) {
      this.$router.push({
        path: `/Business/Contract/ContractDetail/${id}`,
      });
    },
    handleTransferOrder(targetName, targetId) {
      setTimeout(() => {
        this.$router.push({
          path: `/Order/SalesOrderCreate`,
          query: {
            source: 'contract',
            targetName: targetName,
            targetId: targetId,
          },
        });
      }, 300);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Business/Contract/ContractEdit/${id}`,
      });
    },
    // 取消按钮，跳转上一级
    handleCancel() {
      this.$router.back(true);
    },
    async loadProject(id) {
      const projectDetailInfo = await api.business.getProjectDetail(id);

      const projectProductList = await api.business
        .getProjectProductList({
          fdMainId: id,
          pageNo: 1,
          limit: 999,
        })
        .then((res) =>
          (res.data || []).map((d) => {
            return d;
          })
        );

      const productLineList = projectProductList.filter(
        (d, i) =>
          projectProductList.findIndex(
            (_d) => d.fdProductLineCode === _d.fdProductLineCode
          ) === i
      );

      this.formData.fdProjectMainId = id;
      this.formData.fdProjectMainName = projectDetailInfo.fdName;
      this.formData.fdCustMainId = projectDetailInfo.fdCustMainId;
      this.formData.fdCustName = projectDetailInfo.fdCustName;
      this.formData.fdSapCustName = projectDetailInfo.fdSapCustName;
      this.formData.fdSapCustCode = projectDetailInfo.fdSapCustCode;
      this.formData.fdPartyFullName = projectDetailInfo.fdCustName;
      this.formData.contractPriceAddParamLists = projectProductList.map((d) => ({
        ...d,
        id: '',
        fdProductCategoryName:
          d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductCategoryName,
        fdProductName: d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductName,
        fdQuantity: d.fdNum || 0,
        fdProductUnitPrice: d.fdPrice || 0,
        fdTotalAmount: this.getAmount((d.fdPrice || 0) * (d.fdNum || 0)),
        fdDeliveryPlan: d.fdShippingDate
          ? dayjs(d.fdShippingDate).format('YYYY-MM-DD')
          : '',
      }));

      this.formData.fdCorporateCode = projectDetailInfo.fdCorporateCode;
      this.formData.fdCorporateName = projectDetailInfo.fdCorporateName;

      this.getCrmCustInfo(this.formData.fdCustMainId);
    },
    async initFormData(id) {
      this.loading = true;
      try {
        if (!!id) {
          const data = await api.contract.getContractDetail(id);

          this.formData = {
            ...this.formData,
            ...data,
            fdLeaderList: data.fdLeaderList || [],
            fdOtherList: data.fdOtherList || [],
            fdManagerList: data.fdManagerList || [],

            contractPriceAddParamLists: data.contractPriceLists || [],
            contractInstallAddParamLists: data.contractInstallLists || [],
            contractTransportAddParamLists: data.contractTransportLists || [],

            fdBeginTime: data.fdBeginTime
              ? dayjs(data.fdBeginTime).format('YYYY-MM-DD')
              : '',
            fdEndTime: data.fdEndTime ? dayjs(data.fdEndTime).format('YYYY-MM-DD') : '',
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

          // if (this.formData.fdStatus !== 'draft') {
          //   const orderCountTotalInfo = await api.common.getOrderCountTotal(
          //     this.formData.fdProjectMainId,
          //     id,
          //     'contract'
          //   );
          //   this.formData.contractPriceAddParamLists =
          //     this.formData.contractPriceAddParamLists.map((res, i) => ({
          //       ...res,
          //       fdApplyCount: (orderCountTotalInfo[i] || {}).fdApplyCount,
          //       fdAvailable: (orderCountTotalInfo[i] || {}).fdAvailable,
          //     }));
          // }

          if (this.formData.contractInstallAddParamLists[0]) {
            const files = await api.common
              .getFileList({
                attKey: this.installAttKey,
                moudleId: this.formData.contractInstallAddParamLists[0].id,
              })
              .then((res) => res.data);
            this.formData.contractInstallAddParamLists[0] = {
              ...this.formData.contractInstallAddParamLists[0],
              sysAttContractAspectParams: files.map((d) => ({
                value: d.id,
                text: d.fdFileName,
                path: d.fdPath,
              })),
            };

            this.formData.contractInstallAddParamLists = [
              ...this.formData.contractInstallAddParamLists,
            ];
          }
        } else {
          this.formData = {
            ...this.formData,
            fdLoginName: this.user.uid,
            fdUserName: this.user.name,
            fdDeptName: this.userInfo.companyName,
            fdDeptCode: this.userInfo.companyNumber,
            fdUserPhone: this.userInfo.mobile,
            createTime: dayjs().format('YYYY-MM-DD'),
          };

          if (!!this.source && !!this.targetId) {
            if (this.source === 'project') {
              await this.loadProject(this.targetId);
            }
          }
        }
      } finally {
        this.loading = false;
      }
    },

    async getCrmCustInfo(customerId) {
      const cleanSap = () => {
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
      };

      if (!customerId) {
        cleanSap();
        return;
      }

      const crms = await api.price.getCrmCust({
        fdCustMainId: customerId || '',
      });

      const crm = crms[0];
      if (crm) {
        this.formData.fdSapCustName = crm.fdSapCustName;
        this.formData.fdSapCustCode = crm.fdSapCustCode;
      } else {
        cleanSap();
      }
    },

    async submitFormData(formData, action) {
      this.loading = true;

      formData = {
        ...formData,
        fdAttKey: this.attKey,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
          fdAttFileId: d.value,
          fdAttKey: this.attKey,
        })),
        contractInstallAddParamLists: (formData.contractInstallAddParamLists || []).map(
          (d) => ({
            ...d,
            fdAttKey: this.installAttKey,
            sysAttContractAspectParams: (d.sysAttContractAspectParams || []).map((d) => ({
              fdAttFileId: d.value,
              fdAttKey: this.installAttKey,
            })),
          })
        ),
      };

      try {
        switch (action) {
          case 'draft':
            await api.contract.postContractForm({
              ...formData,
              mainId: formData.id,
              fdStatus: 'draft',
            });
            break;
          case 'add':
            await api.contract.postContractForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          case 'edit':
            if (formData.fdStatus === 'draft') {
              await api.contract.postContractForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else if (formData.fdStatus === 'reject') {
              await api.contract.postContractForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else {
              await api.contract.putContractForm(formData);
            }
            break;
          default:
            break;
        }

        this.$message.success('请求成功');

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
      const {
        contractPriceAddParamLists = [],
        // contractTransportAddParamLists = [],
        // contractInstallAddParamLists = []
      } = formData;
      if (contractPriceAddParamLists.length <= 0) {
        this.$message.error('产品信息不能为空');
        return false;
      } else if (!contractPriceAddParamLists.every((d) => !!d.fdProductCategoryName)) {
        this.$message.error('产品信息中产品类型不能为空');
        return false;
      } else if (!contractPriceAddParamLists.every((d) => !!d.fdProductName)) {
        this.$message.error('产品信息中产品型号不能为空');
        return false;
      } else if (!contractPriceAddParamLists.every((d) => !!d.fdDeliveryPlan)) {
        this.$message.error('产品信息中交货计划不能为空');
        return false;
      } else if (!contractPriceAddParamLists.every((d) => d.fdQuantity > 0)) {
        this.$message.error('产品信息中数量不能小于等于0');
        return false;
      }

      if (formData.fdBeginTime > formData.fdEndTime) {
        this.$message.error('合同开始时间不能大于合同截止时间');
        return;
      }

      // if (!contractTransportAddParamLists.every(d => !!d.fdCostBearName)) {
      //   this.$message.error('请完善运输费信息')
      //   return false
      // }

      // if (!contractInstallAddParamLists.every(d => !!d.fdCostBearName)) {
      //   this.$message.error('请完善安装费信息')
      //   return false
      // }

      return true;
    },
  },
};
