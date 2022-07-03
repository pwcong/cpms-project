import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    mixins: [buildSelectionBase()],
  },
  'selection-agency',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getAgencyList({
            limit: 100,
            pageNo: 1,
            fdName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdName,
                value: d.fdCode,
              })),
            };
          });
      },
    },
  }
);
