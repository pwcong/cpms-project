import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import { get } from 'poros/http';

export default buildPropsHOC(
  {
    props: {},
    mixins: [buildSelectionBase()],
    watch: {},
  },
  'selection-user',
  {
    placeholder: {
      type: String,
      default: '请输入姓名/用户名搜索',
    },
    getOptions: {
      type: Function,
      default: (_, query) => {
        return get('/api/poros-permission/secStaff/list', {
          keyword: query.keyword,
          status: 1,
          pageNo: query.pageNo,
          limit: query.pageSize,
        }).then((res) => ({
          data: ((res.data || {}).records || []).map((d) => ({
            ...d,
            text: d.name,
            label: `${d.name} / ${d.uid} / ${d.orgposRemark}`,
            value: d.uid,
          })),
          totalSize: (res.data || {}).total,
        }));
      },
    },
  }
);
