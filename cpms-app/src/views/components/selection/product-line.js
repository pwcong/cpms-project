import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {},
    mixins: [buildSelectionBase()],
    watch: {},
  },
  'selection-product-line',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getProductLineList({
            limit: 100,
            pageNo: 1,
            fdProductLineName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdProductLineName,
                value: d.fdProductLineCode,
                data: d,
              })),
            };
          });
      },
    },
  }
);
