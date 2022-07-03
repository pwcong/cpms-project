import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';
import { buildDynamicText } from '@/components/dynamic-text';

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
        return api.basedata
          .getProvinceList({
            limit: 100,
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

let provinceData = null;

function getProvinceData() {
  return (
    provinceData ||
    (provinceData = api.basedata.getProvinceList({
      limit: 999,
      pageNo: 1,
    }))
  );
}

export const ProvinceText = buildDynamicText('province-text', {
  getData: (_) => {
    return getProvinceData().then((res) => {
      return res.data || [];
    });
  },
});
