import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import { buildDynamicText } from '@/components/dynamic-text';

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

        return api.basedata
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

let cityData = {};

function getCityData(provinceCode) {
  return (
    cityData[provinceCode] ||
    (cityData[provinceCode] = api.basedata.getCityList({
      fdProvinceCode: provinceCode,
      limit: 999,
      pageNo: 1,
    }))
  );
}

export const CityText = buildDynamicText('city-text', {
  properties: {
    provinceCode: {
      type: String,
    },
  },
  getData: (_) => {
    return getCityData(_.provinceCode).then((res) => {
      return res.data || [];
    });
  },
});
