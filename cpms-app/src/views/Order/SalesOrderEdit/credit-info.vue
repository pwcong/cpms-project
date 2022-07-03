<template>
  <block theme="primary" title="资信额度">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.orderCreditAddParams.length > 0">
          <thead>
            <th>产品线</th>
            <th>发货额度</th>
            <th>调差余额</th>
            <th>实际账期</th>
            <th>客户授权书</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.orderCreditAddParams" :key="index">
              <td>{{ item.fdProductLineName }}</td>
              <td>
                {{
                  formatAmount(item.fdAvailableAmount) +
                  ` (资金: ${formatAmount(item.fdFoundAmount)}` +
                  ` , 信用: ${formatAmount(item.fdCreditAmount)})`
                }}
              </td>
              <td>{{ formatAmount(item.fdExpiationAmount) }}</td>
              <td>
                {{
                  item.fdActualAccountPeriod +
                  ` (标准账期: ${item.fdStandardAccountPeriod}` +
                  ` , 宽限度: ${item.fdGraceAccountPeriod})`
                }}
              </td>
              <td>{{ `到期日期：${formatDate(item.fdExpireDate)}` }}</td>
            </tr>
          </tbody>
        </table>
        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>
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
      //   _.tempValue.orderCreditAddParams = await api.order.getOrderCredit(crmCode);
      _.tempValue.orderCreditAddParams = await api.order.getOrderCredit('SHJTV.ZMDJX');
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

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
