import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

let options = null;

export default buildPropsHOC(buildSelectionBase(), 'selection-order-split-status', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return (
        options ||
        (options = api.order
          .getOrderSplitStatus({
            limit: 200,
            pageNo: 1,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                text: d.value.statusName,
                value: d.value.statusCode,
              })),
            };
          }))
      );
    },
  },
});
