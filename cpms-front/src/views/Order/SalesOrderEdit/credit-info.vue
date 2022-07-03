<template>
  <block title="资信额度" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="fdId"
      :loading="loading"
      :columns="[
        {
          title: '产品线',
          dataIndex: 'fdProductLineName',
        },
        {
          title: '发货额度',
          dataIndex: 'fdAvailableAmount',
          scopedSlots: { customRender: 'fdAvailableAmount' },
        },
        {
          title: '调差余额',
          dataIndex: 'fdExpiationAmount',
          customRender: (text, recode) => formatAmount(text),
        },
        {
          title: '实际账期',
          dataIndex: 'fdActualAccountPeriod',
          scopedSlots: { customRender: 'fdActualAccountPeriod' },
        },
        {
          title: '客户授权书',
          dataIndex: 'fdExpireDate',
          customRender: (text, recode) => `到期日期：${formatDate(text)}`,
        },
      ]"
      :data-source="tempValue.orderCreditAddParams"
      bordered
      :pagination="false"
    >
      <template slot="fdAvailableAmount" slot-scope="text, record">
        {{
          formatAmount(record.fdAvailableAmount) +
          ` (资金: ${formatAmount(record.fdFoundAmount)}` +
          ` , 信用: ${formatAmount(record.fdCreditAmount)})`
        }}
      </template>
      <template slot="fdActualAccountPeriod" slot-scope="text, record">
        {{
          record.fdActualAccountPeriod +
          ` (标准账期: ${record.fdStandardAccountPeriod}` +
          ` , 宽限度: ${record.fdGraceAccountPeriod})`
        }}
      </template>
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin, buildListMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    orderCreditAddParams: [],
  },
});

const reqMixin = buildListMixin({
  relation: ['crmCode'],
  getData: async (_, query) => {
    const { mode, crmCode } = _;

    if (mode === 'view') {
      return {};
    }

    if (!!crmCode) {
      _.tempValue.orderCreditAddParams = await api.order.getOrderCredit(crmCode);
      // _.tempValue.orderCreditAddParams = await api.order.getOrderCredit('SHJTV.ZMDJX');
    } else {
      _.tempValue.orderCreditAddParams = [];
    }

    _.onOk();

    return {};
  },
});

export default {
  name: 'credit-info',
  mixins: [selectionMixin, formatMixin, reqMixin],
  props: {
    crmCode: {
      type: String,
    },
    mode: {
      type: String,
    },
  },
};
</script>
