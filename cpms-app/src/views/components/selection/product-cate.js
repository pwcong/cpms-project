import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectionBase(), 'selection-product-cate', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.basedata
        .getProductCateList({
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
