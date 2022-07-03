import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectionBase(), 'product-type', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.contract
        .getProductType({
          limit: 100,
          pageNo: 1,
          fdProductCategoryName: query.keyword,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              ...d,
              text: d.fdProductCategoryName,
              value: d.fdProductCategoryCode,
              data: d,
            })),
          };
        });
    },
  },
});
