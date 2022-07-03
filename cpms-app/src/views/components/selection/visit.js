import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      status: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      status() {
        this.onRefresh();
      },
    },
  },
  'selection-visit',
  {
    getOptions: {
      type: Function,
      default: (_, query) =>
        api.salesman
          .getVisitByIdList({
            limit: 100,
            pageNo: 1,
            fdModuleType: query.keyword,
            fdStatus: _.status,
          })
          .then((res) => ({
            ...res,
            data: (res.data || []).map((d) => ({
              ...d,
              text: `${d.fdModuleType || '<未知名称>'}`,
              value: d.id,
            })),
          })),
    },
  }
);
