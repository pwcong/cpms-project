import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      fdSaleOrgCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      fdSaleOrgCode() {
        this.onRefresh();
      },
    },
  },
  'select-business-department',
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
            fdSaleOrgCode: fdSaleOrgCode,
            fdSaleOfficeName: query.keyword,
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
