import api from '@/api';
import dayjs from 'dayjs';
import { userMixin, formatMixin } from '@/mixins';

function getFormData() {
  return {
    fdBranchCompanyCode: '',
    fdSaleDeptCode: '',
    fdStatus: 'todo',
    fdLoginName: '',
    fdUserName: '',
    fdProjectMainName: '',
    fdProjectMainId: '',
    fdContractDeliveryTime: '',
    fdBeginTime: '',
    fdOrderEndTime: '',
    fdCustName: '',
    fdCustMainId: '',
    fdSapCustCode: '',
    fdSapCustName: '',
    fdChannelOneCode: '',
    fdChannelOneName: '',
    fdChannelTwoCode: '',
    fdChannelTwoName: '',
    fdUserMobile: '',
    fdCity: '',
    fdIsRegion: '',
    fdIsValid: '1',
    fdEstimatedRevenue: '',
    fdCorporateCode: '',
    fdCorporateName: '',
    fdApplyReason: '',
    sysAttContractAspectParams: [],
    priceMessageListAddParams: [],
    priceInstallListAddParams: [
      {
        fdAmount: 0,
        fdCostBearName: '',
        fdCostBearCode: '',
        fdInstallExplain: '',
        version: '',
        fdMainId: '',
        fdIsValid: '1',
        sysAttContractAspectParams: [],
      },
    ],
    priceTransportListAddParams: [
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
        fdTransportTypeName: '',
        fdPaymentTypeName: '',
        fdMainId: '',
        version: '',
        fdIsValid: '1',
      },
    ],
  };
}

function getFormRules({}) {
  return {
    fdProjectMainId: [
      {
        required: true,
        message: '请选择项目名称',
        trigger: 'change',
      },
    ],

    fdContractDeliveryTime: [
      {
        required: true,
        message: '请选择合同交货时间',
        trigger: 'change',
      },
    ],
    fdBeginTime: [
      {
        required: true,
        message: '请选择开始时间',
        trigger: 'change',
      },
    ],
    fdOrderEndTime: [
      {
        required: true,
        message: '请选择开单截止时间',
        trigger: 'change',
      },
    ],
    fdBranchCompanyCode: [
      {
        required: true,
        message: '请选择分公司',
        trigger: 'change',
      },
    ],
    fdSaleDeptCode: [
      {
        required: true,
        message: '请选择销售部',
        trigger: 'change',
      },
    ],

    // fdChannelOneName: [
    //   {
    //     required: true,
    //     message: '一级渠道不能为空',
    //     trigger: 'change'
    //   }
    // ],
    // fdChannelTwoName: [
    //   {
    //     required: true,
    //     message: '二级渠道不能为空',
    //     trigger: 'change'
    //   }
    // ],
    fdSapCustName: [
      {
        required: true,
        message: 'CRM客户名称不能为空',
        trigger: 'change',
      },
    ],
    fdUserName: [
      {
        required: true,
        message: '请输入联系人',
        trigger: 'blur',
      },
    ],
    fdUserMobile: [
      {
        required: true,
        message: '请输入联系电话',
        trigger: 'blur',
      },
    ],
    // sysAttContractAspectParams: [
    //   {
    //     required: true,
    //     message: '请上传价格附件',
    //     trigger: 'change'
    //   }
    // ],

    // fdCorporateCode: [
    //   {
    //     required: true,
    //     message: '请选择分公司',
    //     trigger: 'change'
    //   }
    // ],
    fdApplyReason: [
      {
        required: true,
        message: '请输入申请理由',
        trigger: 'blur',
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
      formData: getFormData(),
      source,
      targetId,
      attKey: 'BUSINESS_PRICE',
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
    fdEstimatedRevenue() {
      return this.formData.priceMessageListAddParams.reduce(
        (p, c) => p + (c.fdTotalAmount || 0),
        0
      );
    },
  },
  methods: {
    // 跳转新增页
    handleCreate() {
      this.$router.push({
        path: '/Business/Price/PriceCreate',
      });
    },
    // 跳转详情页
    handleDetail(id) {
      this.$router.push({
        path: `/Business/Price/PriceDetail/${id}`,
      });
    },
    handleTransferOrder(targetName, targetId) {
      setTimeout(() => {
        this.$router.push({
          path: `/Order/SalesOrderCreate`,
          query: {
            source: 'price',
            targetName: targetName,
            targetId: targetId,
          },
        });
      }, 300);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Business/Price/PriceEdit/${id}`,
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

      // 项目转价格，带现净供价
      const productPriceList = await api.basedata.getProductPrice({
        productCodes: (projectDetailInfo.projectProductListDtoList || []).map(
          (d) => d.fdProductId
        ),
        // productCodes: '010107062542'
      });

      const priceMap = productPriceList.reduce((p, c) => {
        p[c.productCode] = c;
        return p;
      }, {});

      this.formData.fdProjectMainId = id;
      this.formData.fdProjectMainName = projectDetailInfo.fdName;
      this.formData.fdCustMainId = projectDetailInfo.fdCustMainId;
      this.formData.fdCustName = projectDetailInfo.fdCustName;

      this.formData.fdSapCustName = projectDetailInfo.fdSapCustName;
      this.formData.fdSapCustCode = projectDetailInfo.fdSapCustCode;
      this.formData.fdChannelOneName = projectDetailInfo.fdChannelOneName;
      this.formData.fdChannelOneCode = projectDetailInfo.fdChannelOneCode;
      this.formData.fdChannelTwoName = projectDetailInfo.fdChannelTwoName;
      this.formData.fdChannelTwoCode = projectDetailInfo.fdChannelTwoCode;

      // this.formData.fdIsRegion = projectDetailInfo.fdIsRegion
      this.formData.fdCity = (projectDetailInfo.projectSiteListDtoList || [])
        .map((d) => {
          const { fdEntireCountry, fdProvinceName = '', fdCityName = '' } = d;

          if (fdEntireCountry === '1') {
            return '全国';
          }

          if (!!fdProvinceName && !!fdCityName) {
            return `${fdProvinceName}${fdCityName}`;
          }

          return fdProvinceName;
        })
        .join(',');

      this.formData.priceMessageListAddParams = projectProductList.map((d, index) => {
        const t = priceMap[d.fdProductId] || {};

        const price = {
          ...d,
          id: '',
          fdProductCategoryName:
            d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductCategoryName,
          fdProductCategoryCode:
            d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductCategoryCode,
          fdProductName: d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductName,
          fdProductId: d.fdProductCategoryName === '完全定制化' ? '' : d.fdProductId,
          fdQuantity: d.fdNum || 0,
          fdApplyForNetContribution: d.fdPrice || 0,
          // 单台价差
          fdSinglePrice:
            typeof t.productPrice === 'number'
              ? this.getAmount((d.fdPrice || 0) - (t.productPrice || 0))
              : '',
          fdActualOrderPrice: d.fdPrice || 0,
          fdInstallCost: d.fdInstallCost || 0,
          fdUpstairsCost: d.fdUpstairsCost || 0,
          fdSingleProjectCost: d.fdSingleProjectCost || 0,
          fdTotalAmount: this.getAmount((d.fdPrice || 0) * (d.fdNum || 0)),
          fdTotalProjectCost: 0, //总项目费用
          fdTotalApplyPriceAssets:
            typeof t.productPrice === 'number'
              ? this.getAmount(
                  (d.fdNum || 0) * ((d.fdPrice || 0) - (t.productPrice || 0))
                )
              : '',
          fdDeliveryPlan: d.fdShippingDate
            ? dayjs(d.fdShippingDate).format('YYYY-MM-DD')
            : '',
          fdCurrentNetSupplyPrice: t.productPrice,
        };

        return price;
      });

      this.formData.fdCorporateCode = projectDetailInfo.fdCorporateCode;
      this.formData.fdCorporateName = projectDetailInfo.fdCorporateName;
      this.formData.fdIsRegion =
        projectDetailInfo.fdRegionNum === '0' || projectDetailInfo.fdRegionNum === ''
          ? '0'
          : '1';

      this.formData.fdEstimatedRevenue = this.formData.priceMessageListAddParams.reduce(
        (p, c) => p + (c.fdTotalAmount || 0),
        0
      );

      this.getCrmCustInfo(
        this.formData.fdBranchCompanyCode,
        this.formData.fdCustMainId,
        this.formData.fdSaleDeptCode
      );
    },

    async getCrmCustInfo(company, customerId, deptCode) {
      const cleanSap = () => {
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
        this.formData.fdChannelOneName = '';
        this.formData.fdChannelOneCode = '';
        this.formData.fdChannelTwoName = '';
        this.formData.fdChannelTwoCode = '';
      };

      if (!company || !customerId || !deptCode) {
        cleanSap();
        return;
      }

      const crms = await api.price.getCrmCust({
        fdBranchCompanyCode: company || '',
        fdCustMainId: customerId || '',
        fdSaleDeptCode: deptCode || '',
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

    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.price.getPriceDetail(id);

          this.formData = {
            ...this.formData,
            ...data,
            priceMessageListAddParams: data.projectPriceMessageListDtos || [],
            priceInstallListAddParams: data.projectPriceInstallListDtos || [],
            priceTransportListAddParams: data.projectPriceTransportListDtos || [],

            fdContractDeliveryTime: data.fdContractDeliveryTime
              ? dayjs(data.fdContractDeliveryTime).format('YYYY-MM-DD')
              : '',
            fdBeginTime: data.fdBeginTime
              ? dayjs(data.fdBeginTime).format('YYYY-MM-DD ')
              : '',
            fdOrderEndTime: data.fdOrderEndTime
              ? dayjs(data.fdOrderEndTime).format('YYYY-MM-DD ')
              : '',
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
          //     'price'
          //   );
          //   this.formData.priceMessageListAddParams =
          //     this.formData.priceMessageListAddParams.map((res, i) => ({
          //       ...res,
          //       fdApplyCount: (orderCountTotalInfo[i] || {}).fdApplyCount,
          //       fdAvailable: (orderCountTotalInfo[i] || {}).fdAvailable,
          //     }));
          // }

          if (this.formData.priceInstallListAddParams[0]) {
            const files = await api.common.getFileList({
              attKey: this.attKey,
              moudleId: this.formData.priceInstallListAddParams[0].id,
            });
            this.formData.priceInstallListAddParams[0] = {
              ...(this.formData.priceInstallListAddParams[0] || {}),
              sysAttContractAspectParams: files.data.map((d) => ({
                value: d.id,
                text: d.fdFileName,
                path: d.fdPath,
              })),
            };
            this.formData.priceInstallListAddParams = [
              ...this.formData.priceInstallListAddParams,
            ];
          }
        } else {
          this.formData = {
            ...this.formData,
            fdUserName: this.user.name,
            fdLoginName: this.user.uid,
            fdUserMobile: this.userInfo.mobile,
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

    async submitFormData(formData, action) {
      this.loading = true;

      formData = {
        ...formData,
        // fdProjectMainId: formData.fdProjectMainId,
        fdAttKey: this.attKey,
        fdEstimatedRevenue: this.fdEstimatedRevenue,
        sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
          fdAttFileId: d.value,
          fdAttKey: this.attKey,
        })),
        priceInstallListAddParams: (formData.priceInstallListAddParams || []).map(
          (d) => ({
            ...d,
            fdAttKey: this.attKey,
            sysAttContractAspectParams: (d.sysAttContractAspectParams || []).map((d) => ({
              fdAttFileId: d.value,
              fdAttKey: this.attKey,
            })),
          })
        ),
      };

      try {
        switch (action) {
          case 'draft':
            await api.price.postPriceForm({
              ...formData,
              mainId: formData.id,
              fdStatus: 'draft',
            });
            break;
          case 'add':
            await api.price.postPriceForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          case 'edit':
            if (formData.fdStatus === 'draft') {
              await api.price.postPriceForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else if (formData.fdStatus === 'reject') {
              await api.price.postPriceForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else {
              await api.price.putPriceForm(formData);
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
        priceMessageListAddParams = [],
        // priceInstallListAddParams = [],
        // priceTransportListAddParams = []
      } = formData;

      if (priceMessageListAddParams.length <= 0) {
        this.$message.error('价格信息不能为空');
        return false;
      }

      if (!priceMessageListAddParams.every((d) => !!d.fdProductCategoryName)) {
        this.$message.error('价格信息中产品类型不能为空');
        return false;
      }

      if (!priceMessageListAddParams.every((d) => d.fdQuantity > 0)) {
        this.$message.error('价格信息中数量不能小于等于0');
        return false;
      }

      if (!priceMessageListAddParams.every((d) => !!d.fdProductName)) {
        this.$message.error('价格信息中产品型号不能为空');
        return false;
      }

      if (!priceMessageListAddParams.every((d) => !!d.fdDeliveryPlan)) {
        this.$message.error('价格信息中交货计划不能为空');
        return false;
      }

      if (
        !priceMessageListAddParams.every(
          (d) => typeof d.fdCurrentNetSupplyPrice === 'number'
        )
      ) {
        this.$message.error('价格信息中现净供价不能为空');
        return false;
      }

      if (
        !priceMessageListAddParams.every(
          (d) => d.fdApplyForNetContribution <= d.fdCurrentNetSupplyPrice
        )
      ) {
        this.$message.error('价格信息中申请净供价不得高于现进供价');
        return false;
      }

      if (formData.fdBeginTime > formData.fdOrderEndTime) {
        this.$message.error('开单开始时间不能大于开单截止时间');
        return;
      }

      // if (!priceInstallListAddParams.every(d => !!d.fdCostBearName)) {
      //   this.$message.error('请完善安装费信息')
      //   return false
      // }

      // if (!priceTransportListAddParams.every(d => !!d.fdCostBearName)) {
      //   this.$message.error('请完善运输费信息')
      //   return false
      // }

      return true;
    },
  },
};
