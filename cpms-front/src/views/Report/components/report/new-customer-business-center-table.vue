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
      .getCustMainNewCreate({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
      })
      .then((res) => {
        return res.data;
      });

    let clientData = (value || []).map((d) => {
      return { name: d.fdBusinessName, total: d.fdPercentage, value: d.fdNumber };
    });

    clientData.sort(function (a, b) {
      return b.total - a.total;
    });

    return {
      data: clientData.map((d, index) => {
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
          title: '商务中心',
          dataIndex: 'name',
        },
        {
          title: '比例',
          dataIndex: 'total',
        },
        {
          title: '数量',
          dataIndex: 'value',
        },
      ],
    };
  },
};
</script>
