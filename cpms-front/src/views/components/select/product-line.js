import product from 'immer';
import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

const getOption = product((d) => {
  d.text = d.fdProductLineName;
  d.value = d.fdProductLineCode;
  d.data = d;
});

export default buildPropsHOC(buildSelectBase(), 'select-product-line', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.basedata
        .getProductLineList({
          limit: 200,
          pageNo: 1,
          fdProductLineName: query.keyword,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map(getOption),
          };
        });
    },
  },
});
