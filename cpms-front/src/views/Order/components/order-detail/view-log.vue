<template>
  <block title="查看日志" theme="primary">
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
          title: '单据状态',
          dataIndex: 'fdStatus',
        },
        {
          title: '状态描述',
          dataIndex: 'fdMsg',
        },
        {
          title: '更新时间',
          dataIndex: 'fdUpdateTime',
          customRender: (text, record, index) => formatDateTime(record.fdUpdateTime),
        },
        {
          title: '操作人',
          dataIndex: 'fdCreateByName',
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
  relation: ['moduleId', 'visible'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.moduleId || !_.visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getByOrderNo(_.moduleId).then((data) => {
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
  name: 'view-log',
  props: {
    visible: {
      type: Object,
    },
    moduleId: {
      type: String,
    },
    // orderArkLogDtos: {
    //   type: Array,
    // },
  },
  mixins: [listMixin, formatMixin, selectionMixin],
};
</script>
