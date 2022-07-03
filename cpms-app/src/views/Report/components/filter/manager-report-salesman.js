import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionBusiness from '@/views/components/selection/business';
export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionBusiness,
    },
    mixins: [FilterBase],
  },
  'manager-report-salesman',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'sortBy',
          label: '排序方式',
          type: 'selection',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            options: [
              {
                value: 'custNewCreateCount',
                text: '意向客户新增',
              },
              {
                value: 'changedCount',
                text: '线索转项目',
              },
              {
                value: 'projectNewCount',
                text: '项目新增',
              },
              {
                value: 'projectNewSum',
                text: '项目新增金额',
              },
              {
                value: 'validVisitCount',
                text: '有效拜访',
              },
              {
                value: 'validClueFollowCount',
                text: '有效跟进线索',
              },
            ],
          },
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const { sortBy = [] } = filter || {};

  const query = sortBy[0]
    ? { sortBy: (sortBy[0] || {}).value, text: (sortBy[0] || {}).text }
    : { sortBy: 'custNewCreateCount', text: '意向客户新增' };

  return query;
}
