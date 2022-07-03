import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionGrantStatus from '../selection/grant-status';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionBusiness from '@/views/components/selection/business';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionGrantStatus,
      SelectionProductLine,
      SelectionCustomer,
      SelectionBusiness,
    },
    mixins: [FilterBase],
  },
  'project-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdName',
          label: '项目名称',
          type: 'input',
        },
        {
          key: 'createTime',
          label: '选择日期',
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
        {
          key: 'fdProjectStatus',
          label: '项目状态',
          type: 'selection',
          component: 'selection-grant-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdBusinessCenterCode',
          label: '商务中心',
          type: 'selection',
          component: 'selection-business',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdCustMainId',
          label: '客户/代理商',
          type: 'selection',
          component: 'selection-customer',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdProductLine',
          label: '产品线',
          type: 'selection',
          component: 'selection-product-line',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            multiple: true,
          },
        },
        {
          key: 'fdUserName',
          label: '业务员',
          type: 'selection',
          component: 'selection-user',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            searchable: true,
          },
        },
        {
          key: 'updateTime',
          label: '更新时间',
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
  const {
    fdProjectStatus = [],
    fdProductLine = [],
    createTime = [],
    updateTime = [],
    fdUserName = [],
    fdBusinessCenterCode = [],
    fdCustMainId = [],
    fdName = '',
  } = filter || {};

  const query = {
    fdName,
    fdUserName: (fdUserName[0] || {}).uid,
    fdProjectStatus: (fdProjectStatus[0] || {}).value,
    fdProductLine: fdProductLine.map((d) => d.value).join(','),
    fdBusinessCenterCode: (fdBusinessCenterCode[0] || {}).value,
    fdCustMainId: (fdCustMainId[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['fdCreateStartTime'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdCreateEndTime'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  if (!!updateTime[0] && !!updateTime[1]) {
    query['fdUpdateStartTime'] = `${dayjs(updateTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdUpdateEndTime'] = `${dayjs(updateTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
