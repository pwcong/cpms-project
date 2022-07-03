import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectionBase(), 'selection-enum-list', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.order
        .getOrderEnumList({
          limit: 200,
          pageNo: 1,
          keyword: query.fdOrderByList,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: d.value.name,
              value: d.value.code,
            })),
          };
        });
    },
  },
});
