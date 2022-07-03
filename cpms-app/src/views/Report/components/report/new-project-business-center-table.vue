<template>
  <div>
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
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';
import api from '@/api';
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;

    const value = await api.report
      .getProjectMainReportNewCreate({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
      })
      .then((res) => {
        return res.data;
      });

    let projectData = (value || []).map((d) => {
      if (d.fdBusinessName === '其他商务中心合计') {
        return { name: d.fdBusinessName, total: d.fdPercentage + '%', value: d.fdNumber };
      } else {
        return { name: d.fdBusinessName, total: d.fdPercentage, value: d.fdNumber };
      }
    });
    projectData.sort(function (a, b) {
      return b.total - a.total;
    });
    return {
      data: projectData.map((d, index) => {
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
  mixins: [reportMixin, reqMixin],
  data() {
    return {
      columns: [
        {
          title: '序号',
          field: 'index',
        },
        {
          title: '商务中心',
          field: 'name',
        },
        {
          title: '比例',
          field: 'total',
        },
        {
          title: '数量',
          field: 'value',
        },
      ],
    };
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
