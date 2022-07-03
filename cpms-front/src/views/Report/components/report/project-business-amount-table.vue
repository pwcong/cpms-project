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
      .getProjectIndustry({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });

    const dictData = await api.basedata
      .getDictList('cpms', 'cpms_business')
      .then((res) => res.data || []);
    const dictMap = dictData.reduce((p, c) => {
      p[c.value] = c;
      return p;
    }, {});
    const baseData = [
      { value: 0, code: 'hotel', total: 0 },
      { value: 0, code: 'gov', total: 0 },
      { value: 0, code: 'flats', total: 0 },
      { value: 0, code: 'property', total: 0 },
      { value: 0, code: 'business', total: 0 },
      { value: 0, code: 'operators', total: 0 },
      { value: 0, code: 'other', total: 0 },
    ];
    const cache = baseData.reduce((p, c) => {
      p[c.code] = c;
      return p;
    }, {});
    value.data.forEach((d) => {
      if (d.statusCode === '' || d.statusCode === null) {
        return;
      } else {
        cache[d.statusCode] = {
          value: d.percentage + '%',
          code: d.statusCode,
          total: d.total ? d.total : 0,
        };
      }
    });
    let tradeDate = Array.from(Object.keys(cache)).map((k) => {
      const t = cache[k];
      return {
        ...t,
        name: (dictMap[t.code] || {}).text || '-',
      };
    });
    tradeDate.sort(function (a, b) {
      return b.total - a.total;
    });
    return {
      data: tradeDate.map((d, index) => {
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
          title: '行业',
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
