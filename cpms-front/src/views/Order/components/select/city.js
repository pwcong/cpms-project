import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      provinceCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      provinceCode() {
        this.onRefresh();
      },
    },
  },
  'select-city',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { provinceCode } = _;

        if (!provinceCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.order
          .getOrderCityList({
            limit: 200,
            pageNo: 1,
            fdCityName: query.keyword,
            fdProvinceCode: provinceCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdCityName,
                value: d.fdCityCode,
              })),
            };
          });
      },
    },
  }
);
