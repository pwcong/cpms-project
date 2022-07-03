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
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';
import api from '@/api';

const listMixin = buildListMixin({
  relation: ['reportQuery', 'sort'],
  getData: async (_) => {
    const { reportQuery, sort } = _;
    const value = await api.report
      .getClueRankList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'clueFollowCount',
        type: 'and',
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
          title: '比例',
          dataIndex: 'fdPercentage',
        },
        {
          title: '数量',
          dataIndex: 'fdNumber',
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
