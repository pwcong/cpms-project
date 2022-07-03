<template>
  <div class="product-list">
    <p-table
      class="product-list-table"
      :scroll="scrollable ? { x: true } : undefined"
      :columns="columns"
      v-if="tempValue.orderProductLists.length > 0"
      :data-source="tempValue.orderProductLists"
      :pagination="false"
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
            <p-button-link> 删除 </p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <div class="tips" v-else>暂无数据</div>

    <setting-product
      :fzReadOnly="true"
      :billType="tempValue.fdBillType"
      :countyCode="tempValue.fdAddrRegionCode"
      :crmCode="crmCode"
      :partyCode="tempValue.fdSaleOfficeCode"
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="onOk"
    />
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

import SettingProduct from '../SalesOrderEdit/setting-product';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    orderProductLists: [],
  },
});

export default {
  name: 'product-list',
  mixins: [selectionMixin, formatMixin],
  props: {
    crmCode: {
      type: String,
    },
    moduleId: {
      type: String,
    },
    scrollable: {
      type: Boolean,
    },
  },
  components: {
    SettingProduct,
  },
  computed: {
    columns() {
      let result = [
        {
          title: '产品编码',
          dataIndex: 'fdProductCode',
          fixed: this.scrollable ? 'left' : undefined,
        },
        {
          title: '产品型号',
          dataIndex: 'fdProductName',
        },
      ];

      if (this.tempValue.fdBillType !== 'SALES_DELAY_ORDER') {
        result = result.concat([
          {
            title: '可用库存',
            dataIndex: 'fdAvailableStock',
          },
        ]);
      }

      result = result.concat(
        [
          {
            title: '要货数量',
            dataIndex: 'fdApplyCount',
          },
          {
            title: '净供价',
            dataIndex: 'fdCurrentSupplyPrice',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '申请净供价',
            dataIndex: 'fdApplySupplyPrice',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '销售价',
            dataIndex: 'fdSalePrice',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '折扣%',
            dataIndex: 'fdDiscount',
          },
          {
            title: '金额',
            dataIndex: 'fdSettleAmount',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '税率%',
            dataIndex: 'fdTaxRate',
          },
          {
            title: '机器标识',
            dataIndex: 'fdMachineType',
            scopedSlots: { customRender: 'fdMachineType' },
          },
          {
            title: '产品来源',
            dataIndex: 'fdProductSourceNo',
          },
        ].concat(
          !!this.readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  fixed: this.scrollable ? 'right' : undefined,
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      );

      return result;
    },
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleEditItem(item, index) {
      this.itemValue = { ...item };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    async handleDelItem(item, index) {
      if (!!this.moduleId) {
        await api.order.delRemoveProductList(item.id);
      }

      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
.product-list {
  .tips {
    text-align: center;
    font-size: 12px;
    padding: 4px 0;
    color: #999999;
  }

  &-table {
    ::v-deep * {
      border: none !important;
      font-size: 12px;
    }
  }
}
</style>
