<template>
  <block title="价格信息" theme="primary">
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
          title: '客户名称',
          dataIndex: 'fdCustName',
        },
        {
          title: '项目名称',
          dataIndex: 'fdProjectMainName',
        },
        {
          title: '预计收入(元)',
          dataIndex: 'fdEstimatedRevenue',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          customRender: (text, recode) => formatDateTime(text),
        },
        {
          title: '合同交货时间',
          dataIndex: 'fdContractDeliveryTime',
          customRender: (text, recode) => formatDate(text),
        },
        {
          title: '开始时间',
          dataIndex: 'fdBeginTime',
          customRender: (text, recode) => formatDate(text),
        },
        {
          title: '开单截止时间',
          dataIndex: 'fdOrderEndTime',
          customRender: (text, recode) => formatDate(text),
        },
        {
          title: '审批状态',
          dataIndex: 'fdStatus',
          scopedSlots: { customRender: 'fdStatus' },
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
      <template slot="fdStatus" slot-scope="text">
        {{ text | foramtStatus }}
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
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdProjectMainId: _.moduleId,
  }),
  getData: (_, query) => {
    return !!query.fdProjectMainId
      ? api.price.getPriceList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'price-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
  methods: {
    // 跳转详情页
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Price/PriceDetail/${record.id}`,
        // query: {
        //   id: record.id,
        // },
      });
    },
  },

  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '待审批';
        case 'reject':
          return '驳回';
        case 'pass':
          return '审批通过';
        case 'audit':
          return '审批中';
        default:
          return v;
      }
    },
  },
};
</script>
