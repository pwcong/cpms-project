import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      id: {
        type: String,
      },
      filterFlag: {
        type: String,
      },
      moduleFlag: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
  },
  'sap-customer',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { id, filterFlag, moduleFlag } = _;
        return api.customer
          .getAffiliatedAgents({
            id: id,
            filterFlag: filterFlag,
            moduleFlag: moduleFlag,
            fdStatus: 'pass',
            limit: 200,
            fdCustName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                text: d.fdCustName,
                value: d.id,
              })),
            };
          });
      },
    },
  }
);
