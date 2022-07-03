<template>
  <block title="产品信息" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="fdId"
      :loading="loading"
      :columns="[
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
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
          title: '要货数量',
          dataIndex: 'fdApplyCount',
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
      ]"
      :data-source="orderProductListsDto"
      bordered
      :pagination="false"
    >
      <template slot="fdMachineType" slot-scope="text">
        <dict-text
          :value="(text || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_order_machine_type"
        />
      </template>
    </p-table>
  </block>
</template>

<script>
import { formatMixin } from '@/mixins';

export default {
  name: 'product-info',
  mixins: [formatMixin],
  props: {
    orderProductListsDto: {
      type: Array,
    },
  },
};
</script>
