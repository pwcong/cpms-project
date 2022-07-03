import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      fdCorporateCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      fdCorporateCode() {
        this.onRefresh();
      },
    },
  },
  'selection-sales-organization',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { fdCorporateCode } = _;

        if (!fdCorporateCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.customer
          .getSalesOrganization({
            limit: 200,
            pageNo: 1,
            fdSaleOrgName: query.keyword,
            fdCorporateCode: fdCorporateCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.records || []).map((d) => ({
                ...d,
                text: d.fdSaleOrgName,
                value: d.fdSaleOrgCode,
              })),
            };
          });
      },
    },
  }
);
