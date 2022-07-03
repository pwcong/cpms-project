<template>
  <block title="审批记录" theme="primary">
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
          dataIndex: 'fdTime',
          customRender: (text, record, index) => formatDateTime(record.fdTime),
        },
        {
          title: '节点',
          dataIndex: 'fdNodeName',
          customRender: (text, record, index) =>
            `${record.fdNodeName}(${record.fdNodeId})`,
        },
        {
          title: '操作人',
          dataIndex: 'fdUserName',
        },
        {
          title: '动作',
          dataIndex: 'fdActionInfo',
        },
        {
          title: '审批意见',
          dataIndex: 'fdOpinion',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 80,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
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
      <template slot="operation">
        <span>
          <template v-if="!!processUrl">
            <a :href="processUrl" target="_blank">
              <p-button-link type="primary">查看OA流程</p-button-link>
            </a>
          </template>
        </span>
      </template>
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import config from '@/config';

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
      ? api.common.getAuditRecord(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'audit-record',
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  computed: {
    processUrl() {
      const process = (this.list || [])[0];
      if (!process) {
        return;
      }

      return process.fdUrl;
    },
  },
};
</script>
