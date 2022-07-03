<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>系统运维管理</p-breadcrumb-item>
            <p-breadcrumb-item>发版日志</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="发版日期">
            <p-range-picker v-model="query.date" />
          </p-switch-form-item>
          <template slot="button">
            <p-button type="primary" @click="onRefresh(false)" icon="search" />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
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
              title: '发版内容',
              dataIndex: 'fdDesc',
              ellipsis: true,
            },
            {
              title: '发版日期',
              dataIndex: 'fdDate',
              width: 150,
              customRender: (text, record, index) => formatDateTime(record.fdDate),
              align: 'center',
            },
            {
              title: '发版人',
              dataIndex: 'fdUserName',
              width: 80,
              align: 'center',
            },
            {
              title: '发版状态',
              dataIndex: 'fdStatusName',
              width: 150,
              align: 'center',
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
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin } from '@/mixins';
import api from '@/api';

const listMixin = buildListMixin({
  properties: [
    {
      key: 'date',
      value: [],
    },
  ],
  getQuery: (_, query) => {
    const { date = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
    };

    if (date.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdDateStartTime: `${date[0].format('YYYY-MM-DD')} 00:00:00`,
        fdDateEndTime: `${date[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: (_, query) => {
    return api.common.getPublishLogList(query);
  },
});

export default {
  name: '发版日志',
  mixins: [listMixin, formatMixin],
  components: {},
  data() {
    return {};
  },
  methods: {
    handleDetail(record) {
      // TODO
    },
  },
};
</script>

<style lang="scss" scoped></style>
