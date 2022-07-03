<template>
  <div @drag.stop>
    <ve-table
      class="report-table"
      :columns="columns.map((d) => ({ ...d, key: d.field }))"
      :table-data="list"
      :maxHeight="350"
    />
    <div v-if="list.length <= 0" style="line-height: 96px; text-align: center; font-size: 12px; color: #aaaaaa">
      暂无数据
    </div>
  </div>
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
        type: 'number',
        flag: 'newCreate',
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
          field: 'index',
        },
        {
          title: '部门',
          field: 'fdBusinessName',
        },
        {
          title: '比例',
          field: 'fdPercentage',
        },
        {
          title: '数量',
          field: 'fdNumber',
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
<style lang="scss" scoped>
.report-table {
  /deep/ th {
    white-space: nowrap;
  }

  /deep/ th,
  /deep/ td {
    font-size: 12px !important;
  }
}
</style>
