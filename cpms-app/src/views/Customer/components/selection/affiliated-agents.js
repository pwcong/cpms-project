import api from '@/api';
import {
  buildSelectionBase
} from '@/components/selection-base';
import {
  buildPropsHOC
} from '@/utils/hoc';

export default buildPropsHOC({
    props: {
      id: {
        type: String,
      },
      filterFlag: {
        type: Number,
      },
      moduleFlag: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      type() {
        this.onRefresh();
      },
    },
  },
  'selection-affiliated-agents', {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const {
          id,
          filterFlag,
          moduleFlag
        } = _;
        return api.customer
          .getAffiliatedAgents({
            id: id,
            filterFlag: filterFlag,
            moduleFlag: moduleFlag,
            fdStatus: "todo,audit,pass",
            limit: 200
          }).then((res) => {
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
