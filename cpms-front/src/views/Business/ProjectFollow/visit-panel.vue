<template>
  <block title="拜访信息" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="id"
      :loading="loading"
      :columns="[
        {
          title: '序号',
          dataIndex: 'index',
          width: 50,
          fixed: 'left',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '拜访类型',
          dataIndex: 'fdVisitType',
          scopedSlots: { customRender: 'fdVisitType' },
        },
        {
          title: '拜访名称',
          dataIndex: 'fdModuleType',
        },
        {
          title: '拜访人',
          dataIndex: 'fdVisitName',
        },
        {
          title: '拜访地址',
          dataIndex: 'fdVisitAddress',
        },
        {
          title: '拜访目的',
          dataIndex: 'fdVisitPurpose',
        },
        {
          title: '打卡状态',
          dataIndex: 'fdClockCount',
          customRender: (text, record) => (record.fdClockCount > 0 ? '已打卡' : '未打卡'),
        },
        {
          title: '反馈状态',
          dataIndex: 'fdFeedbackCount',
          customRender: (text, record) =>
            record.fdFeedbackCount > 0 ? '已反馈' : '未反馈',
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
      <template slot="fdVisitType" slot-scope="text, record">
        <dict-text
          dictCode="cpms_visit_type"
          systemCode="cpms"
          :value="(record.fdVisitType || '').split(',')"
        />
      </template>
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
    fdModuleTypeId: _.moduleId,
  }),
  getData: (_, query) => {
    return !!query.fdModuleTypeId
      ? api.salesman.getVisitByIdList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'visit-panel',
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
        path: `/Salesman/Visit/VisitDetail/${record.id}`,
        // query: {
        //   id: record.id,
        // },
      });
    },
  },
};
</script>
