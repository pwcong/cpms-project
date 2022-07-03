import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionProjectType from '../selection/project-type';
import SelectionGrantStatus from '../selection/grant-status';
import SelectionProductLine from '@/views/components/selection/product-line';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionProjectType,
      SelectionGrantStatus,
      SelectionProductLine,
    },
    mixins: [FilterBase],
  },
  'project-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdProjectTypeId',
          label: '项目类型',
          type: 'selection',
          component: 'selection-project-type',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdStatus',
          label: '项目状态',
          type: 'selection',
          component: 'selection-grant-status',
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
  const { fdStatus = [], fdProductLine = [], createTime = [], updateTime = [], fdProjectTypeId = [] } = filter || {};

  const query = {
    fdStatus: (fdStatus[0] || {}).value,
    fdProductLine: fdProductLine.map((d) => d.value).join(','),
    fdProjectTypeId: (fdProjectTypeId[0] || {}).value,
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
