import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectBase(), 'select-province', {
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
});
