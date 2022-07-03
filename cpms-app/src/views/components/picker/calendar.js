import { Picker } from 'vant';
import { buildPropsHOC } from '@/utils';
import dayjs from 'dayjs';

const now = dayjs();

export const CALENDAR_RANGE = [
  {
    text: '本月',
    value: [now.startOf('M').startOf('d'), now.endOf('M').endOf('d')],
    monthOrWeek: 'month',
  },
  {
    text: '本周',
    value: [now.startOf('week').add(1, 'day'), now.endOf('week').add(1, 'day')],
    monthOrWeek: 'week',
  },
  {
    text: '上月',
    value: [now.subtract(1, 'M').startOf('M').startOf('d'), now.subtract(1, 'M').endOf('M').endOf('d')],
    monthOrWeek: 'month',
  },
  {
    text: '上周',
    value: [now.add(-1, 'week').startOf('week').add(1, 'day'), now.add(-1, 'week').endOf('week').add(1, 'day')],
    monthOrWeek: 'week',
  },
  {
    text: '今年',
    value: [now.startOf('year').startOf('d'), now.endOf('year').endOf('d')],
    monthOrWeek: 'year',
  },
  // {
  //   text: '今天',
  //   value: [now.startOf('d'), now.endOf('d')],
  // },
  // {
  //   text: '昨天',
  //   value: [now.subtract(1, 'd').startOf('d'), now.subtract(1, 'd').endOf('d')],
  // },
];

export const CALENDAR_OPTIONS = CALENDAR_RANGE.map((d) => ({
  ...d,
  value: d.value.map((_d) => _d.format('YYYY-MM-DD HH:mm:ss')).join(','),
}));

export default buildPropsHOC(Picker, 'picker-calendar', {
  columns: {
    type: Array,
    default: () => CALENDAR_OPTIONS,
  },
});
