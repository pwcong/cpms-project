<template>
  <block title="操作记录" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="id"
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
          dataIndex: 'createTime',
          customRender: (text, record, index) => formatDateTime(record.createTime),
        },
        {
          title: '操作',
          dataIndex: 'fdOperationFullTitle',
        },
      ]"
      :data-source="list"
      bordered
      :pagination="{
        current: pageNo,
        pageSize: pageSize,
        total: totalSize,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(pageNo = $event.current) && (pageSize = $event.pageSize)"
    >
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  relation: ['moduleId', 'moduleFlag'],
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdModuleId: _.moduleId,
    fdModuleFlag: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdModuleId && !!query.fdModuleFlag
      ? api.common.getModifyRecord(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'modify-record',
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
};
</script>
