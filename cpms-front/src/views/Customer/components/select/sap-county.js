import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      cityCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      cityCode() {
        this.onRefresh();
      },
    },
  },
  'select-county',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { cityCode } = _;

        if (!cityCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.customer
          .getCountyList({
            limit: 200,
            pageNo: 1,
            fdCountyName: query.keyword,
            fdCityCode: cityCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdCountyName,
                value: d.fdCountyCode,
              })),
            };
          });
      },
    },
  }
);
