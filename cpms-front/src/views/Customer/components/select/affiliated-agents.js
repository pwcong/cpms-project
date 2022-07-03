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
  'customer-affiliated-agents',
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
            fdStatus: 'todo,audit,pass',
            limit: 200,
            pageNo: 1,
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
