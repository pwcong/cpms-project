import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      need: {
        type: Array,
        default: () => [],
      },
      productLineCode: {
        type: String,
      },
      getText: {
        type: Function,
        default: (d) => `${d.fdProductName}(${d.fdProductSku})`,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      need() {
        this.onRefresh();
      },
      productLineCode() {
        this.onRefresh();
      },
    },
  },
  'select-product',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        if (!_.need.every((k) => _[k] !== undefined && _[k] !== '')) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.basedata
          .getProductList({
            limit: 200,
            pageNo: 1,
            keyword: query.keyword,
            fdIsDingzhihua: '0',
            fdProductLineCode: _.productLineCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdProductName,
                value: d.fdProductSku,
                label: _.getText(d),
                data: d,
              })),
            };
          });
      },
    },
  }
);
