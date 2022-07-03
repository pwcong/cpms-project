import { buildSelectBase } from '@/components/select-base';
import { buildDynamicText } from '@/components/dynamic-text';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

let options = null;

function getOptions(query) {
  return (
    options ||
    (options = api.order
      .getOrderStatus({
        limit: 200,
        pageNo: 1,
        enumName: query.keyword,
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
}

export const OrderStatusText = buildDynamicText('order-status-text', {
  getData: (_) => {
    return getOptions().then((res) => res.data || []);
  },
});

export default buildPropsHOC(buildSelectBase(), 'select-order-status', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return getOptions(query).then((res) => ({
        ...res,
        data: !!query.keyword
          ? (res.data || []).filter((d) => d.text.indexOf(query.keyword) > -1)
          : res.data,
      }));
    },
  },
});
