import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionPriceStatus from '../selection/price-status';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionCustomer,
      SelectionPriceStatus,
    },
    mixins: [FilterBase],
  },
  'contract-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdCustMainId',
          label: '客户名称',
          type: 'selection',
          component: 'selection-customer',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            searchable: true,
            status: 'pass',
          },
        },
        {
          key: 'fdStatus',
          label: '审批状态',
          type: 'selection',
          component: 'selection-price-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'createTime',
          label: '创建时间',
          type: 'calendar',
          getText: (v) => {
            if (!v || !v[0] || !v[1]) {
              return '';
            }
            return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format('YYYY-MM-DD')}`;
          },
          props: {
            type: 'range',
            minDate: CALENDAR_MIN_DATE,
            maxDate: CALENDAR_MAX_DATE,
          },
        },
      ],
    },
  }
);
``;
export function convertFilter2Query(filter) {
  const { createTime = [], fdProjectTypeId = [], fdStatus = [], fdCustMainId = [] } = filter || {};

  const query = {
    fdProjectTypeId: (fdProjectTypeId[0] || {}).value,
    fdStatus: (fdStatus[0] || {}).value,
    fdCustMainId: (fdCustMainId[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['fdBeginTime'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdEndTime'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }
  return query;
}
