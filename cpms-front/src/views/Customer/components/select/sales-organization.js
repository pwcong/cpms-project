import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      fdCorporateCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      fdCorporateCode() {
        this.onRefresh();
      },
    },
  },
  'select-sales-organization',
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
