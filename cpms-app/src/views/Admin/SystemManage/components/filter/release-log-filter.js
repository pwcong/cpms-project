import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {},
    mixins: [FilterBase],
  },
  'release-log-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdDate',
          label: '提问时间',
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
  const { fdDate = [] } = filter || {};

  const query = {};

  if (!!fdDate[0] && !!fdDate[1]) {
    query['fdDateStartTime'] = `${dayjs(fdDate[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdDateEndTime'] = `${dayjs(fdDate[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
