import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      fdSaleOrgCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      fdSaleOrgCode() {
        this.onRefresh();
      },
    },
  },
  'selection-business-department',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { fdSaleOrgCode } = _;

        if (!fdSaleOrgCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.customer
          .getBusinessDepartment({
            limit: 200,
            pageNo: 1,
            fdSaleOfficeName: query.keyword,
            fdSaleOrgCode: fdSaleOrgCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.records || []).map((d) => ({
                ...d,
                text: d.fdSaleOfficeName,
                value: d.fdSaleOfficeCode,
              })),
            };
          });
      },
    },
  }
);
