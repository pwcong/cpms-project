<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <div class="project" v-if="mode === 'fromProject'">
      <div class="project-name">
        <span style="color: #666666"> 项目名称： </span>
        <span> {{ projectData.fdName || '&lt;无&gt;' }} </span>
      </div>
      <p-radio-group
        class="project-flag"
        @change="handleChangeProjectFlag"
        :value="projectFlag"
      >
        <p-radio v-for="item in projectFlags" :key="item.value" :value="item.value">
          {{ item.text }}
        </p-radio>
      </p-radio-group>
    </div>
    <p-table
      :scroll="{ x: true }"
      :row-selection="{
        selectedRowKeys: tempValue.map((d) => d.id),
        onChange: onSelectChange,
      }"
      rowKey="id"
      :loading="loading"
      :columns="columns"
      :data-source="list"
      bordered
      :pagination="false"
    >
      <template slot="fdApplyCount" slot-scope="text, record">
        <p-input-number
          style="width: 150px"
          :min="0"
          :step="1"
          :precision="0"
          v-show="tempMap[record.id]"
          v-model="record.fdApplyCount"
          placeholder="请输入"
        />
      </template>
    </p-table>

    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button
        type="primary"
        :loading="loading"
        @click="handleSubmit()"
        :disabled="tempValue.length <= 0"
      >
        确 定
      </p-button>
    </span>
  </p-modal>
</template>

<script>
import _ from 'lodash';
import api from '@/api';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';

export const EModule = {
  project: 'project',
  price: 'price',
  contract: 'contract',
};

export const EMode = {
  transfer: 'transfer',
  fromProject: 'fromProject',
};

export const EFromProjectFlag = EModule;
export const EFromProjectFlags = [
  {
    value: EModule.project,
    text: '从项目加载产品',
  },
  {
    value: EModule.price,
    text: '从关联的价格加载产品',
  },
  {
    value: EModule.contract,
    text: '从关联的合同加载产品',
  },
];

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

function getProductListFromProject(id) {
  return api.business
    .getProjectDetail(id)
    .then((res) => res.projectProductListDtoList || [])
    .then((data) =>
      data.map((d) => ({
        ...d,
        fdProductLineCode: d.fdProductLineCode,
        fdProductLineName: d.fdProductLineName,
        fdProductCode: d.fdProductId,
        fdProductName: d.fdProductName,
        fdAvailableCount: 0,
        fdSalePrice: d.fdPrice,
        fdShippingDate: d.fdShippingDate,
        fdApplyCount: d.fdNum,
      }))
    );
}

function getProductListFromContract(id) {
  return api.contract
    .getContractDetail(id)
    .then((res) => res.contractPriceLists || [])
    .then((data) =>
      data.map((d) => ({
        ...d,
        fdProductLineCode: d.fdProductLineCode,
        fdProductLineName: d.fdProductLineName,
        fdProductCode: d.fdProductId,
        fdProductName: d.fdProductName,
        fdAvailableCount: 0,
        fdSalePrice: d.fdProductUnitPrice,
        fdShippingDate: d.fdDeliveryPlan,
        fdApplyCount: d.fdQuantity,
      }))
    );
}

function getProductListFromPrice(id) {
  return api.price
    .getPriceDetail(id)
    .then((res) => res.projectPriceMessageListDtos || [])
    .then((data) =>
      data.map((d) => ({
        ...d,
        fdProductLineCode: d.fdProductLineCode,
        fdProductLineName: d.fdProductLineName,
        fdProductCode: d.fdProductId,
        fdProductName: d.fdProductName,
        fdAvailableCount: 0,
        fdSalePrice: d.fdActualOrderPrice,
        fdShippingDate: d.fdDeliveryPlan,
        fdApplyCount: d.fdQuantity,
      }))
    );
}

const listMixin = buildListMixin({
  relation: ['mode', 'module', 'moduleId', 'visible'],
  getData: async (_, query) => {
    const { mode, module, moduleId, projectFlag, visible } = _;

    _.tempValue = [];

    if (!moduleId || !visible) {
      return Promise.resolve({
        data: [],
      });
    }

    let productList = [];
    if (mode === EMode.transfer) {
      let checked = false;
      let fdProjectMainId = '';
      switch (module) {
        case EModule.project:
          checked = true;
          fdProjectMainId = moduleId;
          break;
        case EModule.price:
          checked = true;
          fdProjectMainId = await api.price
            .getPriceDetail(moduleId)
            .then((res) => res.fdProjectMainId);
          break;
        case EModule.contract:
          checked = true;
          fdProjectMainId = await api.contract
            .getContractDetail(moduleId)
            .then((res) => res.fdProjectMainId);
          break;
        default:
          break;
      }

      if (checked) {
        productList = await api.order
          .getConvert2OrderProductList({
            fdProjectMainId,
            id: moduleId,
            productSourceType: module,
          })
          .then((res) => res.productListDtos || [])
          .then((data) =>
            data.map((d, i) => ({
              ...d,
              id: i,
              fdProductLineCode: d.fdProductLineCode,
              fdProductLineName: d.fdProductLineName,
              fdProductCode: d.fdProductCode,
              fdProductName: d.fdProductName,
              fdAvailableCount: d.fdCount,
              fdCurrentSupplyPrice: 0,
              fdApplySupplyPrice: d.fdApplySupplyPrice || 0,
              fdSalePrice: d.fdUnitPrice,
              fdShippingDate: d.fdDeliveryPlan,
              fdApplyCount: d.fdQuantity || 0,
              fdProductSourceId: d.fdProductSourceId,
              fdProductSourceNo: d.fdProductSourceNo,
              fdProductSourceType: d.fdProductSourceType,
              fdProductListId: d.fdProductListId,
            }))
          );
      }
    }

    if (mode === EMode.fromProject) {
      _.projectData = await api.business.getProjectDetail(moduleId);

      productList = await api.order
        .getProjectOrPriceOrContractProductList({
          fdProjectMainId: moduleId,
          fdType: projectFlag,
        })
        .then((data) =>
          data.map((d, i) => ({
            ...d,
            id: i,
            fdProductLineCode: d.fdProductLineCode,
            fdProductLineName: d.fdProductLineName,
            fdProductCode: d.fdProductCode,
            fdProductName: d.fdProductName,
            fdAvailableCount: d.fdCount,
            fdCurrentSupplyPrice: 0,
            fdApplySupplyPrice: d.fdApplySupplyPrice || 0,
            fdSalePrice: d.fdUnitPrice,
            fdShippingDate: d.fdDeliveryPlan,
            fdApplyCount: d.fdCount || 0,
            fdProductSourceId: d.fdProductSourceId,
            fdProductSourceNo: d.fdProductSourceNo,
            fdProductSourceType: d.fdProductSourceType,
            fdProductListId: d.fdProductListId,
          }))
        );
    }

    return Promise.resolve({
      data: productList,
    });
  },
});

export default {
  name: 'product-transfer',
  mixins: [selectionMixin, listMixin, formatMixin],
  props: {
    title: {
      type: String,
    },
    module: {
      type: String,
    },
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      selectionProductList: [],
      projectFlags: EFromProjectFlags,
      projectFlag: EFromProjectFlag.project,
      projectData: {},
    };
  },
  computed: {
    columns() {
      const map = {
        index: {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        fdProductLineName: {
          title: '产品线',
          dataIndex: 'fdProductLineName',
        },
        fdProductCode: {
          title: '产品编码',
          dataIndex: 'fdProductCode',
        },
        fdProductName: {
          title: '产品型号',
          dataIndex: 'fdProductName',
        },
        fdAvailableCount: {
          title: '可用数量',
          dataIndex: 'fdAvailableCount',
        },
        fdSalePrice: {
          title: '开单价（元）',
          dataIndex: 'fdSalePrice',
          customRender: (text, record, index) => this.formatAmount(record.fdSalePrice),
        },
        fdShippingDate: {
          title: '交货计划时间',
          dataIndex: 'fdShippingDate',
          customRender: (text, record, index) => this.formatDate(record.fdShippingDate),
        },
        fdApplyCount: {
          title: '下单数量',
          dataIndex: 'fdApplyCount',
          scopedSlots: { customRender: 'fdApplyCount' },
          fixed: 'right',
          width: 120,
        },
        fdProductSourceNo: {
          title: '单据号',
          dataIndex: 'fdProductSourceNo',
        },
        createBy: {
          title: '创建人',
          dataIndex: 'createByName',
        },
        createTime: {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        fdApplyReason: {
          title: '申请理由概述',
          dataIndex: 'fdApplyReason',
        },
      };

      switch (this.mode) {
        case EMode.transfer:
          return [
            map.index,
            map.fdProductSourceNo,
            map.fdProductLineName,
            map.fdProductCode,
            map.fdProductName,
            map.fdAvailableCount,
            map.fdSalePrice,
            map.fdShippingDate,
            map.fdApplyCount,
          ];
        case EMode.fromProject:
          return [
            map.index,
            map.fdProductSourceNo,
            map.fdProductLineName,
            map.fdProductCode,
            map.fdProductName,
            map.fdAvailableCount,
            map.fdSalePrice,
            map.fdShippingDate,
            map.createBy,
            map.createTime,
            map.fdApplyReason,
            map.fdApplyCount,
          ];
        default:
          return [];
      }
    },
    listMap() {
      return (this.list || []).reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {});
    },
    tempMap() {
      return (this.tempValue || []).reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {});
    },
  },
  methods: {
    handleChangeProjectFlag(e) {
      this.projectFlag = e.target.value;
      this.tempValue = [];
      this.onRefresh();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.tempValue = this.list.filter((d) => selectedRowKeys.indexOf(d.id) > -1);
    },
    checkApplyCount() {
      if (!this.tempValue.every((d) => d.fdApplyCount <= d.fdAvailableCount)) {
        return false;
      }
      return true;
    },
    checkValue() {
      if (!this.tempValue.every((d) => d.fdApplyCount > 0)) {
        this.$message.error('产品下单数量禁止小于或等于0');
        return false;
      }
      return true;
    },
    async resolveProductPrice() {
      const pricesMap = (
        await api.basedata.getProductPrice({
          productCodes: this.tempValue.map((d) => d.fdProductCode),
        })
      ).reduce((p, c) => {
        p[c.productCode] = c.productPrice;
        return p;
      }, {});
      return this.tempValue.map((d) => {
        const { fdApplyCount = 0, fdSalePrice = 0, fdDiscount = 100 } = d;

        return {
          ...d,
          fdCurrentSupplyPrice: pricesMap[d.fdProductCode] || 0,
          fdSettleAmount: this.getAmount(fdApplyCount * fdSalePrice * (fdDiscount / 100)),
        };
      });
    },
    handleSubmit: _.debounce(function () {
      if (this.loading || !this.checkValue()) {
        return;
      }
      this.loading = true;

      this._handleSubmit();
    }, 100),
    async _handleSubmit() {
      this.loading = true;
      try {
        this.tempValue = this.tempValue.map((d) => ({
          ...d,
          fdSalePrice: Number(d.fdSalePrice),
          fdApplyCount: Number(this.listMap[d.id].fdApplyCount),
        }));
        this.tempValue = await this.resolveProductPrice();

        const checked = this.checkApplyCount();
        if (!checked) {
          this.$confirm({
            title: '部分产品下单数量大于可用数量，是否继续?',
            onOk: () => {
              this.onOk();
            },
            onCancel: () => {},
          });
        } else {
          this.onOk();
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.project {
  font-size: 14px;
  padding: 8px 12px;
  background-color: #eeeeee;
  &-name {
    margin-bottom: 8px;
  }
}
</style>
