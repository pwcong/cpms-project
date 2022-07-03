<template>
  <p-modal
    :maskClosable="false"
    title="查看产品"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <p-table
      :scroll="{ x: true }"
      :loading="loading"
      :columns="[
        {
          title: '产品编码',
          dataIndex: 'fdProductCode',
        },
        {
          title: '产品型号',
          dataIndex: 'fdProductName',
        },
        {
          title: '可用库存',
          dataIndex: 'fdAvailableStock',
        },
        {
          title: '要货数量',
          dataIndex: 'fdApplyCount',
        },
        {
          title: '净供价',
          dataIndex: 'fdCurrentSupplyPrice',
          customRender: (v) => formatAmount(v),
        },
        {
          title: '申请净供价',
          dataIndex: 'fdApplySupplyPrice',
          customRender: (v) => formatAmount(v),
        },
        {
          title: '销售价',
          dataIndex: 'fdSalePrice',
          customRender: (v) => formatAmount(v),
        },
        {
          title: '折扣%',
          dataIndex: 'fdDiscount',
        },
        {
          title: '金额',
          dataIndex: 'fdSettleAmount',
          customRender: (v) => formatAmount(v),
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
      ]"
      :data-source="list"
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
    </p-table>

    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

const listMixin = buildListMixin({
  relation: ['moduleId', 'visible'],
  getData: (_, query) => {
    const { moduleId, visible } = _;

    if (!moduleId || !visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getOrderProductList(moduleId).then((data) => ({
      data,
    }));
  },
});

export default {
  name: 'modal-product-list',
  mixins: [selectionMixin, listMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
};
</script>
