<template>
  <block title="更新记录" theme="primary">
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
          title: '时间',
          dataIndex: 'updateTime',
          customRender: (text, record, index) => formatDateTime(record.updateTime),
        },
        {
          title: '操作',
          dataIndex: 'operationlog',
        },
      ]"
      :data-source="list"
      bordered
      :pagination="{
        current: currentNo,
        pageSize: currentSize,
        total: list.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(currentNo = $event.current) && (currentSize = $event.pageSize)"
    >
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin, buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const listMixin = buildListMixin({
  relation: ['moduleNumber', 'visible'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.moduleNumber || !_.visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getOrderFindPushLog(_.moduleNumber, 'updated').then((data) => {
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
  name: 'updated-record',
  props: {
    visible: {
      type: Object,
    },
    moduleNumber: String,
  },
  mixins: [listMixin, formatMixin, selectionMixin],
  data() {
    return {
      currentNo: 1,
      currentSize: 10,
    };
  },
};
</script>
