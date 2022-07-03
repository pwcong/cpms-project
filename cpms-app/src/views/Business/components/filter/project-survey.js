import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionProjectType from '../selection/project-type';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionProjectStatus from '@/views/components/selection/project-status';

export default buildPropsHOC(
  {
    components: {
      SelectionProjectType,
      SelectionCustomer,
      SelectionProductLine,
      SelectionProjectStatus,
    },
    mixins: [FilterBase],
  },
  'project-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdCustMainId',
          label: '客户/代理商',
          type: 'selection',
          component: 'selection-customer',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            searchable: true,
            status: 'pass',
          },
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
          key: 'fdProjectStatus',
          label: '项目状态',
          type: 'selection',
          component: 'selection-project-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            multiple: true,
          },
        },
        {
          key: 'createTime',
          label: '创建时间',
          type: 'calendar',
          getText: (v) => {
            if (!v || !v[0] || !v[1]) {
              return '';
            }
            return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format(
              'YYYY-MM-DD'
            )}`;
          },
          props: {
            type: 'range',
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
            return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format(
              'YYYY-MM-DD'
            )}`;
          },
          props: {
            type: 'range',
          },
        },
      ],
    },
  }
);
``;
export function convertFilter2Query(filter) {
  const {
    fdCustMainId = [],
    fdProductLine = [],
    fdProjectStatus = [],
    createTime = [],
    updateTime = [],
    fdProjectTypeId = [],
  } = filter || {};

  const query = {
    fdCustMainId: (fdCustMainId[0] || {}).value,
    fdProductLine: fdProductLine.map((d) => d.value).join(','),
    fdProjectStatus: fdProjectStatus.map((d) => d.value).join(','),
    fdProjectTypeId: (fdProjectTypeId[0] || {}).value,
  };
  if (!!createTime[0] && !!createTime[1]) {
    query['fdCreateStartTime'] = `${dayjs(createTime[0]).format(
      'YYYY-MM-DD'
    )} 00:00:00`;
    query['fdCreateEndTime'] = `${dayjs(createTime[1]).format(
      'YYYY-MM-DD'
    )} 23:59:59`;
  }

  if (!!updateTime[0] && !!updateTime[1]) {
    query['fdUpdateStartTime'] = `${dayjs(updateTime[0]).format(
      'YYYY-MM-DD'
    )} 00:00:00`;
    query['fdUpdateEndTime'] = `${dayjs(updateTime[1]).format(
      'YYYY-MM-DD'
    )} 23:59:59`;
  }

  return query;
}
