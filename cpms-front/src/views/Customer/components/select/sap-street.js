import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      countyCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      countyCode() {
        this.onRefresh();
      },
    },
  },
  'select-street',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { countyCode } = _;

        if (!countyCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.customer
          .getStreetList({
            limit: 200,
            pageNo: 1,
            fdStreetName: query.keyword,
            fdCountyCode: countyCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdStreetName,
                value: d.fdStreetCode,
              })),
            };
          });
      },
    },
  }
);
