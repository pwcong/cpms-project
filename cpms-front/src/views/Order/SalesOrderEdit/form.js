import dayjs from 'dayjs';
import api from '@/api';
import { userMixin, formatMixin } from '@/mixins';

export function getFormData() {
  return {
    fdProjectId: '',
    fdProjectName: '',
    fdBillType: '',
    fdSalesManId: '',
    fdSalesMan: '',
    fdBranchCompanyName: '',
    fdBranchCompanyCode: '',
    fdBillCreateDate: '',
    fdBusiness: '',
    fdSaleOfficeCode: '',
    fdSaleOfficeName: '',
    fdCpmsCustName: '',
    fdCpmsCustId: '',
    fdCustOrderNo: '',
    fdInvoiceMsg: '',
    fdApplyCustomerName: '',
    fdApplyCustomerCode: '',
    fdSettleCustomerName: '',
    fdSettleCustomerCode: '',
    fdShipCustomerName: '',
    fdShipCustomerCode: '',
    fdShipType: '',
    fdAddrProvince: '',
    fdAddrProvinceCode: '',
    fdAddrCity: '',
    fdAddrCityCode: '',
    fdAddrRegion: '',
    fdAddrRegionCode: '',
    fdAddrContactName: '',
    fdAddrCode: '',
    fdAddrPostCode: '',
    fdAddrIdentityCode: '',
    fdAddrMobile: '',
    fdAddrDetail: '',
    fdAddrStreet: '',
    fdAddrStreetCode: '',
    fdAddrTelephone: '',
    fdIsDistribution: '',
    fdLoginName: '',
    fdUserName: '',
    orderCreditAddParams: [],
    sysAttContractAspectParams: [],
    orderProductListDtos: [],
    orderProductListAddParamList: [],
    orderSplitDtos: [],
    // orderCreditDtos: [],
  };
}

export function getFormRules({ fdBillType }) {
  return {
    fdProjectName: [
      {
        required: fdBillType !== 'RETAIL_ORDER' ? true : false,
        message: '请选择关联项目',
        trigger: 'change',
      },
    ],
    fdBillType: [
      {
        required: true,
        message: '请选择单据类型',
        trigger: 'change',
      },
    ],
    fdSalesManId: [
      {
        required: true,
        message: '请选择业务员',
        trigger: 'change',
      },
    ],
    fdBranchCompanyCode: [
      {
        required: true,
        message: '请输入分公司',
        trigger: 'blur',
      },
    ],
    fdBillCreateDate: [
      {
        required: true,
        message: '请选择开单日期',
        trigger: 'change',
      },
    ],
    fdSaleOfficeCode: [
      {
        required: true,
        message: '请输入销售部',
        trigger: 'blur',
      },
    ],
    fdCpmsCustName: [
      {
        required: true,
        message: '请输入CPMS客户名称',
        trigger: 'blur',
      },
    ],
    fdApplyCustomerName: [
      {
        required: true,
        message: '请输入要货客户',
        trigger: 'blur',
      },
    ],
    fdSettleCustomerName: [
      {
        required: true,
        message: '请输入结算客户',
        trigger: 'blur',
      },
    ],
    fdShipCustomerName: [
      {
        required: true,
        message: '请输入配送客户',
        trigger: 'blur',
      },
    ],
    fdShipType: [
      {
        required: true,
        message: '请选择配送方式',
        trigger: 'change',
      },
    ],
    fdAddrDetail: [
      {
        required: true,
        message: '请选择配送地址',
        trigger: 'change',
      },
    ],
    fdAddrContactName: [
      {
        required: true,
        message: '请输入收货人',
        trigger: 'blur',
      },
    ],
    fdAddrIdentityCode: [
      {
        required: fdBillType === 'ELECTRONIC_SALES_ORDER' ? true : false,
        message: '请输入收货人身份证',
        trigger: 'blur',
      },
    ],
    fdLoginName: [
      {
        required: true,
        message: '请选择oa账号',
        trigger: 'change',
      },
    ],
  };
}

// 刷新库存
export async function refreshProductList(_, productList = []) {
  // const remove = _.$message.loading('刷新库存中', 0);

  let result = productList;
  try {
    const temp = productList.filter((d) => !!d.fdProductCode && !!d.fdWarehouseCode);
    if (temp.length > 0) {
      const data = await api.order.postBatchSkuStock(
        temp.map((d) => ({
          skuCode: d.fdProductCode,
          productLineCode: d.fdProductLineCode,
          warehouseCode: d.fdWarehouseCode,
        }))
      );

      const warehouseMap = (data || []).reduce((p, c) => {
        p[c.warehouseCode] = p[c.warehouseCode] || {};
        p[c.warehouseCode][c.skuCode] = c;
        return p;
      }, {});

      result = result.map((d) => {
        d = { ...d };
        const t = (warehouseMap[d.fdWarehouseCode] || {})[d.fdProductCode];
        !!t && (d.fdAvailableStock = t.usableQuantity);
        return d;
      });
    }
  } finally {
    // remove();
    return result;
  }
}

// 刷新订单
export async function refreshOrderList(_, id) {
  // const remove = _.$message.loading('刷新订单中', 0);
  let result = [];
  try {
    result = await api.order.getOrderSplitList(id);
  } finally {
    // remove();
    return result;
  }
}

export default {
  mixins: [userMixin, formatMixin],
  data() {
    return {
      attKey: 'ORDER_FILE',
      loading: false,
      formData: getFormData(),
      inited: false,
    };
  },
  computed: {
    formRules() {
      return getFormRules(this.formData);
    },
  },
  methods: {
    handleCancel() {
      this.$router.back(true);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Order/SalesOrderEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Order/SalesOrderCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Order/SalesOrderDetail/${id}`,
      });
    },
    async loadProject(id) {
      if (!!id) {
        const projectDetailInfo = await api.business.getProjectDetail(id);
        // const res = await api.order.getConvert2OrderProductList({
        //   fdProjectMainId: id,
        //   id: this.targetId,
        //   productSourceType: this.source,
        // });
        // console.log('转订单', res);
        // console.log('projectDetailInfo', projectDetailInfo);
        this.formData.fdProjectId = id;
        this.formData.fdProjectName = projectDetailInfo.fdName;
        this.formData.fdCpmsCustName = projectDetailInfo.fdCustName;
        this.formData.fdCpmsCustId = projectDetailInfo.fdCustMainId;
        this.formData.fdBranchCompanyName = projectDetailInfo.fdCorporateName;
        this.formData.fdBranchCompanyCode = projectDetailInfo.fdCorporateCode;

        // this.formData.fdApplyCustomerName = res.fdApplyCustomerName;
        // this.formData.fdApplyCustomerCode = res.fdApplyCustomerCode;
        // this.formData.fdBusinessName = res.fdBusinessName;
        // this.formData.fdBusinessCode = res.fdBusinessCode;
        // this.formData.fdSaleOfficeName = res.fdSaleOfficeName;
        // this.formData.fdSaleOfficeCode = res.fdSaleOfficeCode;
      } else {
        this.formData.fdProjectId = '';
        this.formData.fdProjectName = '';
        this.formData.fdSaleOfficeName = '';
        this.formData.fdSaleOfficeCode = '';
        this.formData.fdBranchCompanyName = '';
        this.formData.fdBranchCompanyCode = '';
        this.formData.fdCpmsCustName = '';
        this.formData.fdCpmsCustId = '';
      }
    },

    async initFormData(id) {
      this.loading = true;

      const { source, targetId } = this.$route.query;
      // console.log('source', source);
      // console.log('targetId', targetId);

      try {
        if (!!id) {
          const data = await api.order.getOrderDetail(id);

          console.log('销售订单详情', data);
          this.formData = {
            ...this.formData,
            ...data,
            orderProductListAddParamList: data.orderProductListDtos || [],
            orderSplitDtos: data.orderSplitDtos || [],
            orderCreditAddParams: data.orderCreditDtos || [],
            fdBillCreateDate: data.fdBillCreateDate
              ? dayjs(data.fdBillCreateDate).format('YYYY-MM-DD')
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
        } else {
          this.formData = {
            ...this.formData,
            // fdLoginName: this.user.uid,
            // fdUserName: this.user.name,
            // fdUserPhone: this.userInfo.mobile,
            fdBillCreateDate: dayjs().format('YYYY-MM-DD'),
          };

          if (!!source && !!targetId) {
            this.convert2Order(source, targetId);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async convert2Order(source, targetId) {
      let productId = '';
      switch (source) {
        case 'project':
          productId = targetId;
          this.loadProject(productId);
          break;
        case 'price':
          productId = await api.price
            .getPriceDetail(targetId)
            .then((res) => res.fdProjectMainId);
          this.loadProject(productId);
          break;
        case 'contract':
          productId = await api.contract
            .getContractDetail(targetId)
            .then((res) => res.fdProjectMainId);
          this.loadProject(productId);
          break;
        default:
          break;
      }

      this.billTypeVisible = true;
    },

    async submitFormData(formData, action) {
      this.loading = true;
      // console.log('formData', formData);

      const productList = (formData.orderProductListAddParamList || []).map((d) => ({
        ...d,
        fdApplyCount: Number(d.fdApplyCount),
        fdApplySupplyPrice: Number(d.fdApplySupplyPrice),
        fdAvailableStock: Number(d.fdAvailableStock),
        fdCurrentSupplyPrice: Number(d.fdCurrentSupplyPrice),
        fdDiscount: Number(d.fdDiscount),
        fdSalePrice: Number(d.fdSalePrice),
        fdSettleAmount: Number(d.fdSettleAmount),
        fdTaxRate: Number(d.fdTaxRate),
      }));

      formData = {
        ...formData,
        // fdAttKey: this.attKey,
        sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
          fdAttFileId: d.value,
          fdAttKey: this.attKey,
        })),
        orderCreditAddParams: formData.orderCreditAddParams,
        orderProductListAddParamList: productList,
        orderProductListDtos: productList,
      };

      try {
        switch (action) {
          case 'draft':
            await api.order.postOrderForm({
              ...formData,
              mainId: formData.id,
              fdStatus: 'draft',
            });
            break;
          case 'add':
            await api.order.postOrderForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          case 'edit':
            if (formData.fdStatus === 'draft') {
              await api.order.postOrderForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else if (formData.fdStatus === 'reject') {
              await api.order.postOrderForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else {
              await api.order.putOrderForm(formData);
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
      const { fdBillType, orderProductListAddParamList = [] } = formData;

      if (orderProductListAddParamList.length <= 0) {
        this.$message.error('产品信息不能为空');
        return false;
      }

      if (
        !orderProductListAddParamList.every(
          (d) =>
            !!d.fdProductLineCode &&
            !!d.fdProductCode &&
            (fdBillType === 'SALES_DELAY_ORDER' ||
              (fdBillType !== 'SALES_DELAY_ORDER' && d.fdWarehouseCode)) &&
            !!d.fdMachineType
        )
      ) {
        this.$message.error('产品信息中产品必填字段不能为空');
        return false;
      }

      if (
        !orderProductListAddParamList.every(
          (d) =>
            (d.fdSalePrice || 0) >=
            Math.max(d.fdCurrentSupplyPrice || 0, d.fdApplySupplyPrice || 0)
        )
      ) {
        this.$message.error('产品信息中产品销售价金额需大于净供价和申请净供价');
        return false;
      }

      if (!orderProductListAddParamList.every((d) => d.fdSalePrice > 0)) {
        this.$message.error('产品信息中产品销售价禁止小于等于0');
        return false;
      }

      if (
        fdBillType === 'SALES_DELAY_ORDER' &&
        !orderProductListAddParamList.every(
          (d, i) =>
            orderProductListAddParamList.findIndex(
              (_d) => d.fdProductCode === _d.fdProductCode
            ) === i
        )
      ) {
        this.$message.error(
          '订单类型为延期销售单时，产品信息中产品编码不能重复,请检查产品信息中是否存在相同产品编码'
        );
        return false;
      }

      if (
        !orderProductListAddParamList.every(
          (d, i) =>
            orderProductListAddParamList.findIndex(
              (_d) =>
                d.fdProductCode === _d.fdProductCode &&
                d.fdWarehouseCode === _d.fdWarehouseCode
            ) === i
        )
      ) {
        this.$message.error(
          '产品信息中相同仓库，产品不能重复，请检查产品信息中是否存在相同产品'
        );
        return false;
      }

      return true;
    },
  },
};
