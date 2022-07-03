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
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;
    const value = await api.report
      .getProjectMainReportChannel({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'newCreate',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    let projectData = [];
    projectData = (value || []).map((d) => {
      return { name: d.name, value: d.percentage + '%', total: d.total };
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
          dataIndex: 'index',
        },
        {
          title: '渠道',
          dataIndex: 'name',
        },
        {
          title: '比例',
          dataIndex: 'value',
        },
        {
          title: '数量',
          dataIndex: 'total',
        },
      ],
    };
  },
};
</script>
