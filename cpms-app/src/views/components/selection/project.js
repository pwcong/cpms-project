import api from '@/api';

import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      customerId: {
        type: String,
      },
      status: {
        type: String,
        default: 'todo,audit,follow,done',
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
      customerId() {
        this.onRefresh();
      },
      validate() {
        this.onRefresh();
      },
      status() {
        this.onRefresh();
      },
    },
  },
  'selection-project',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.business
          .getProjectList({
            limit: 100,
            pageNo: 1,
            fdName: query.keyword,
            fdCustMainId: _.customerId,
            fdProjectStatus: _.status,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).filter(_.validate).map((d) => ({
                ...d,
                text: d.fdName,
                value: d.id,
                data: d,
              })),
            };
          });
      },
    },
  }
);
