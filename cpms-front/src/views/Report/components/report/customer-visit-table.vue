<template>
  <list-layout>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
          :scroll="{ x: true }"
          rowKey="id"
          :loading="loading"
          :columns="columns.map((d) => ({ ...d, key: d.field }))"
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
  getData: async (_, query) => {
    const { reportQuery, sort } = _;

    const value = await api.report
      .getRankList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        type: 'and',
        fdStatus: 'cust',
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
  name: '授权列表',
  mixins: [listMixin, reportMixin],

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
      default: 'desc',
    },
  },
};
</script>

<style lang="scss" scoped></style>
