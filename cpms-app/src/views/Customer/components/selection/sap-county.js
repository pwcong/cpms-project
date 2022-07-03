import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(
  {
    props: {
      cityCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      cityCode() {
        this.onRefresh();
      },
    },
  },
  'selection-county',
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
            limit: 100,
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
