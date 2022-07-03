<template>
  <block title="物流信息" theme="primary">
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
          title: '快递单号',
          dataIndex: 'fdExpressNumber',
        },
        {
          title: '承运商',
          dataIndex: 'fdCarrier',
        },
        {
          title: '更新时间',
          dataIndex: 'logisticsUpdateTime',
          customRender: (text, record, index) =>
            formatDateTime(record.logisticsUpdateTime),
        },
        {
          title: '状态描述',
          dataIndex: 'fdStatus',
        },
      ]"
      :data-source="list"
      bordered
      :pagination="false"
    >
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const listMixin = buildListMixin({
  relation: ['moduleId', 'logisticsId'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.moduleId || !_.logisticsId) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order
      .getOrderTrackInfo({
        // orderId: '092107300000081',
        // logisticsOrder: 'SF1160102229322',
        orderId: _.moduleId,
        logisticsOrder: _.logisticsId,
      })
      .then((data) => {
        return {
          data: data.map((d, i) => ({
            ...d,
            id: i,
          })),
        };
      });
  },
});

export default {
  name: 'logistics-info',
  props: {
    logisticsId: {
      type: String,
    },
    moduleId: {
      type: String,
    },
  },
  // updated() {
  //   console.log('AAA', this.moduleId);
  //   console.log('BBB', this.logisticsId);
  // },
  mixins: [listMixin, formatMixin, selectionMixin],
};
</script>
