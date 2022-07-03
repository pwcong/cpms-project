import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      countyCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      countyCode() {
        this.onRefresh();
      },
    },
  },
  'selection-county',
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
            limit: 100,
            pageNo: 1,
            fdStreetName: query.keyword,
            fdcountyCode: countyCode,
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
