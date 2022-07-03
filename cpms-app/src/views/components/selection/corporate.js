import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';
import { buildDynamicText } from '@/components/dynamic-text';

export default buildPropsHOC(
  {
    mixins: [buildSelectionBase()],
  },
  'selection-corporate',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getCorporateList({
            limit: 100,
            pageNo: 1,
            fdCorporateName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: `${d.fdCorporateName}`,
                value: d.fdCorporateCode,
                data: d,
              })),
            };
          });
      },
    },
  }
);

let corporateData = null;

function getCorporateData() {
  return (
    corporateData ||
    (corporateData = api.basedata.getCorporateList({
      limit: 999,
      pageNo: 1,
    }))
  );
}

export const CorporateText = buildDynamicText('corporate-text', {
  getData: (_) => {
    return getCorporateData().then((res) => {
      return res.data || [];
    });
  },
});
