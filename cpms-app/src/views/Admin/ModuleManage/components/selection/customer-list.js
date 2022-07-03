import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      status: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
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
          .getAllCustList({
            limit: 200,
            pageNo: 1,
            fdCustName: query.keyword,
            fdStatus: _.status,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
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
