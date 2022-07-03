import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      type: String,
      productLineCode: String,
    },
    mixins: [buildSelectionBase()],
    watch: {
      type() {
        this.onRefresh();
      },
      productLineCode() {
        this.onRefresh();
      },
    },
  },
  'selection-product',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getProductList({
            limit: 100,
            pageNo: 1,
            keyword: query.keyword,
            fdIsDingzhihua: _.type || '0',
            fdProductLineCode: _.productLineCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdProductName,
                value: d.fdProductSku,
                label: `${d.fdProductName}(${d.fdProductSku})`,
                data: d,
              })),
            };
          });
      },
    },
  }
);
