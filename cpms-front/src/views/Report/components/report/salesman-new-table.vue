<template>
  <list-layout>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
          :scroll="{ x: true }"
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="list"
          bordered
        >
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';

const listMixin = buildListMixin({
  relation: ['reportQuery', 'sort'],
  getData: async (_) => {
    const { reportQuery, sort } = _;

    const value = await api.report
      .getVisitList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        sort: sort,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    return {
      data: value.map((d, index) => {
        return {
          ...d,
          id: index,
          index: `${index + 1}`,
        };
      }),
    };
  },
});

export default {
  mixins: [reportMixin, listMixin],
  data() {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
        },
        {
          title: '部门',
          dataIndex: 'fdBusinessName',
        },
        {
          title: '拜访计划数',
          dataIndex: 'fdNumber',
        },
        {
          title: '有效拜访数',
          dataIndex: 'fdFeedCount',
        },
      ],
    };
  },
  props: {
    sort: {
      type: String,
      default: 'asc',
    },
  },
};
</script>
