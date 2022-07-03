import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      status: {
        type: String,
      },
      validate: {
        type: Function,
        default: function () {
          return true;
        },
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      validate() {
        this.onRefresh();
      },
      status() {
        this.onRefresh();
      },
    },
  },
  'selection-customer',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.customer
          .getCommonCustomerList({
            limit: 100,
            pageNo: 1,
            fdCustName: query.keyword,
            fdStatus: _.status,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || [])
                .filter((d) => _.validate(d))
                .map((d) => ({
                  ...d,
                  text: d.fdCustName,
                  value: d.id,
                  data: d,
                })),
            };
          });
      },
    },
  }
);
