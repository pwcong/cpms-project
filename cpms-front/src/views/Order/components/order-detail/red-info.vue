<template>
  <block title="冲红信息" theme="primary">
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
          title: '冲红单号',
          dataIndex: 'a',
        },
        {
          title: '产品编码',
          dataIndex: 'b',
        },
        {
          title: '产品名称',
          dataIndex: 'c',
        },
        {
          title: '冲红数量',
          dataIndex: 'd',
        },
        {
          title: '开单日期',
          dataIndex: 'e',
        },
        {
          title: '状态',
          dataIndex: 'f',
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
  relation: ['moduleId'],
  getData: (_, query) => {
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  name: 'red-info',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
};
</script>
