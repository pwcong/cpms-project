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
      .getCustMainIndustry({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });

    const dictData = await api.basedata.getDictList('cpms', 'cpms_business').then((res) => res.data || []);
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
          field: 'index',
        },
        {
          title: '行业',
          field: 'name',
        },
        {
          title: '比例',
          field: 'value',
        },
        {
          title: '数量',
          field: 'total',
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
