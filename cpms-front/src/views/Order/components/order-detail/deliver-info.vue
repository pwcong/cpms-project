<template>
  <block title="出库信息" theme="primary">
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
          title: '出库单号',
          dataIndex: 'fdDeliveryNumber',
        },
        {
          title: '出库数量',
          dataIndex: 'fdDeliveryCount',
        },
        {
          title: '出库时间',
          dataIndex: 'fdDeliveryTime',
          customRender: (text, record, index) => formatDateTime(record.fdDeliveryTime),
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
  relation: ['moduleId'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.moduleId) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getByChildOrderNo(_.moduleId).then((data) => {
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
  name: 'deliver-info',
  props: {
    moduleId: {
      type: String,
    },
    // orderSplitDeliveryDtos: {
    //   type: Array,
    // },
  },
  mixins: [listMixin, formatMixin, selectionMixin],
};
</script>
