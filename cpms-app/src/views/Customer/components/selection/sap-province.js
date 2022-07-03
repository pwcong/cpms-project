import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {},
    mixins: [buildSelectionBase()],
    watch: {},
  },
  'selection-province',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.customer
          .getProvinceList({
            limit: 200,
            pageNo: 1,
            fdProvinceName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdProvinceName,
                value: d.fdProvinceCode,
              })),
            };
          });
      },
    },
  }
);
