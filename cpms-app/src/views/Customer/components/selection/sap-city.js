import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      provinceCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      provinceCode() {
        this.onRefresh();
      },
    },
  },
  'selection-province',
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

        return api.customer
          .getCityList({
            limit: 100,
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
