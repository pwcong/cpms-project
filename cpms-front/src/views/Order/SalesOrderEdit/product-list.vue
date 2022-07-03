<template>
  <block class="product-list" title="产品信息" theme="primary">
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增产品
      </p-button>
      <p-button
        style="margin-left: 8px"
        type="primary"
        v-if="!readOnly"
        @click="showBatch = true"
      >
        批量设置
      </p-button>
      <p-button
        type="primary"
        style="margin-left: 8px"
        v-if="!readOnly && tempValue.orderProductListAddParamList.length > 0"
        @click="handleRefreshStock"
      >
        刷新库存
      </p-button>
      <p-button
        type="primary"
        style="margin-left: 8px"
        v-if="!readOnly && !!tempValue.fdProjectId"
        @click="showLoad = true"
      >
        加载产品
      </p-button>
      <!-- <p-button
        type="primary"
        style="margin-left: 8px"
        v-if="
          !readOnly
        "
        @click="showImport = true"
      >
        导入产品
      </p-button> -->
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="
        columns.concat(
          [
            {
              title: '要货数量',
              dataIndex: 'fdApplyCount',
            },
            {
              title: '净供价(元)',
              dataIndex: 'fdCurrentSupplyPrice',
              customRender: (v) => formatAmount(v),
            },
            {
              title: '申请净供价(元)',
              dataIndex: 'fdApplySupplyPrice',
              customRender: (v) => formatAmount(v),
            },
            {
              title: '销售价(元)',
              dataIndex: 'fdSalePrice',
              customRender: (v) => formatAmount(v),
            },
            {
              title: '折扣%',
              dataIndex: 'fdDiscount',
            },
            {
              title: '金额(元)',
              dataIndex: 'fdSettleAmount',
              customRender: (v) => formatAmount(v),
            },
            {
              title: '税率%',
              dataIndex: 'fdTaxRate',
            },
            {
              title: '产品来源',
              dataIndex: 'fdProductSourceNo',
            },
          ].concat(
            !!readOnly
              ? []
              : [
                  {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 80,
                    fixed: 'right',
                    scopedSlots: { customRender: 'operation' },
                  },
                ]
          )
        )
      "
      :data-source="tempValue.orderProductListAddParamList"
      :pagination="false"
      bordered
    >
      <template slot="fdMachineType" slot-scope="text, record">
        <dict-text
          systemCode="cpms"
          dictCode="cpms_order_machine_type"
          :value="(record.fdMachineType || '').split(',')"
        />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-popconfirm
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <div class="product-counter">
      <span class="product-counter-val">
        合计数量：<span>{{ totalCount }}</span>
      </span>
      <span class="product-counter-val">
        合计金额：<span>{{ formatAmount(totalAmount) }}</span>
      </span>
    </div>

    <batch-product
      :moduleId="moduleId"
      :value="tempValue"
      :visible.sync="showBatch"
      @change="(tempValue = $event) && handleOk()"
    />

    <setting-product
      :billType="tempValue.fdBillType"
      :countyCode="tempValue.fdAddrRegionCode"
      :crmCode="tempValue.fdApplyCustomerCode"
      :partyCode="tempValue.fdSaleOfficeCode"
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />

    <product-transfer
      title="加载产品"
      mode="fromProject"
      :moduleId="tempValue.fdProjectId"
      :visible.sync="showLoad"
      @change="handleTransferProductList"
    />
    <!-- <import-product :visible.sync="showImport" @change="handleImportProduct" /> -->
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import BatchProduct from './batch-product';
import SettingProduct from './setting-product';
import ProductTransfer from '../components/product-transfer';
// import ImportProduct from './import-product';
import { refreshProductList } from './form';
import { defaultProductItem } from './data';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    orderProductListAddParamList: [],
  },
});

export default {
  name: 'product-list',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
    fdBillType: {
      type: String,
    },
  },
  components: {
    BatchProduct,
    SettingProduct,
    ProductTransfer,
    // ImportProduct,
  },
  data() {
    return {
      showBatch: false,
      showLoad: false,
      showImport: false,
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  computed: {
    totalCount() {
      return (this.tempValue.orderProductListAddParamList || []).reduce(
        (p, c) => p + (c.fdApplyCount || 0),
        0
      );
    },
    totalAmount() {
      return (this.tempValue.orderProductListAddParamList || []).reduce(
        (p, c) => p + (c.fdSettleAmount || 0),
        0
      );
    },
    columns() {
      return [
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '产品线',
          dataIndex: 'fdProductLineName',
        },
        {
          title: '产品编码',
          dataIndex: 'fdProductCode',
        },
        {
          title: '产品型号',
          dataIndex: 'fdProductName',
        },
        {
          title: '机器标识',
          dataIndex: 'fdMachineType',
          scopedSlots: { customRender: 'fdMachineType' },
        },
      ].concat(
        this.fdBillType === 'SALES_DELAY_ORDER'
          ? []
          : [
              {
                title: '仓库',
                dataIndex: 'fdWarehouseName',
              },
              {
                title: '可用库存',
                dataIndex: 'fdAvailableStock',
                customRender: (text, record, index) =>
                  `${record.fdWarehouseName ? text : ''}`,
              },
            ]
      );
    },
  },
  methods: {
    handleOk() {
      this.tempValue.orderProductListAddParamList = [
        ...this.tempValue.orderProductListAddParamList,
      ];
      this.tempValue = {
        ...this.tempValue,
        fdTotalCount: this.totalCount,
        fdTotalAmount: this.totalAmount,
      };

      this.onOk();
    },
    handleAddItem() {
      this.handleEditItem({}, -1);
    },
    handleEditItem(item, index) {
      this.itemValue = { ...item };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    async handleDelItem(item, index) {
      if (!!this.moduleId && !!item.id) {
        await api.order.delRemoveProductList(item.id);
      }

      this.tempValue.orderProductListAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(item) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.itemIndex > -1) {
        this.tempValue.orderProductListAddParamList[this.itemIndex] = item;
      } else {
        this.tempValue.orderProductListAddParamList.push(item);
      }
      this.handleOk();
    },
    async handleRefreshStock() {
      this.tempValue.orderProductListAddParamList = await refreshProductList(
        this,
        this.tempValue.orderProductListAddParamList
      );
      this.handleOk();
    },
    handleTransferProductList(res) {
      this.tempValue.orderProductListAddParamList.push(
        ...res.map((d) => ({
          ...defaultProductItem,
          fdProductLineCode: d.fdProductLineCode,
          fdProductLineName: d.fdProductLineName,
          fdProductCode: d.fdProductCode,
          fdProductName: d.fdProductName,
          fdSalePrice: d.fdSalePrice,
          fdShippingDate: d.fdShippingDate,
          fdApplyCount: d.fdApplyCount,
          fdCurrentSupplyPrice: d.fdCurrentSupplyPrice,
          fdApplySupplyPrice: d.fdApplySupplyPrice,
          fdProductSourceId: d.fdProductSourceId,
          fdProductSourceNo: d.fdProductSourceNo,
          fdProductSourceType: d.fdProductSourceType,
          fdProductListId: d.fdProductListId,
          fdSettleAmount: d.fdSettleAmount,
        }))
      );
      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.product {
  &-list {
  }

  &-counter {
    padding: 8px 0;
    color: #666666;
    font-size: 14px;
    &-val {
      margin-right: 16px;
    }
    &-val span {
      font-size: 16px;
      color: $theme-color;
    }
  }
}
</style>
