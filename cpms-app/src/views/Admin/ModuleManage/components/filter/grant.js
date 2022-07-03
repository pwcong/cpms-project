import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';

import SelectionGrantStatus from '../selection/grant-status';
import SelectionCustomer from '@/views/components/selection/customer';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

const getText = (v) => {
  if (!v || !v[0] || !v[1]) {
    return '';
  }
  return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format('YYYY-MM-DD')}`;
};

export default buildPropsHOC(
  {
    components: {
      SelectionGrantStatus,
      SelectionCustomer,
    },
    mixins: [FilterBase],
  },
  'grant-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdCustId',
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
          label: '项目状态',
          type: 'selection',
          component: 'selection-grant-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'createTime',
          label: '创建时间',
          type: 'calendar',
          getText,
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

export function convertFilter2Query (filter) {
  const { createTime = [], fdStatus = [], fdCustId = [] } = filter || {};

  const query = {
    fdStatus: (fdStatus[0] || {}).value,
    fdCustId: (fdCustId[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['fdCreateBeginTime'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdCreateEndTime'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
