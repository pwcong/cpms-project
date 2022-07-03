<template>
  <block title="授权信息" theme="primary">
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
          title: '被授权代理商名称',
          dataIndex: 'fdCustName',
        },
        {
          title: '项目名称',
          dataIndex: 'fdProjectName',
        },
        {
          title: '盖章法人',
          dataIndex: 'fdCorporateName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '被授权时间起',
          dataIndex: 'fdBeginTime',
        },
        {
          title: '授权理由',
          dataIndex: 'fdReasonSummary',
        },
        {
          title: '授权状态',
          dataIndex: 'fdStatus',
          customRender: (text, record, index) => foramtStatus(record.fdStatus),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 50,
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
      <template slot="operation" slot-scope="text, record">
        <span>
          <p-button-link @click="handleDetail(record)">详情</p-button-link>
        </span>
      </template>
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdProjectMainId: _.moduleId,
  }),
  getData: (_, query) => {
    return !!query.fdProjectMainId
      ? api.grant.getProjectGrantList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'grant-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin],
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
  methods: {
    // 跳转详情页
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Grant/GrantDetail/${record.id}`,
        // query: {
        //   id: record.id,
        // },
      });
    },
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'success':
          return '通过';
        case 'done':
          return '完成';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '暂存';
        default:
          return v;
      }
    },
  },
};
</script>
