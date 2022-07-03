import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import dayjs from 'dayjs';
const now = dayjs();
export default buildPropsHOC(buildSelectBase(), 'report-time', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: '本月',
            value: [
              now.startOf('M').startOf('d').format('YYYY-MM-DD HH:mm:ss'),
              now.endOf('M').endOf('d').format('YYYY-MM-DD HH:mm:ss'),
            ],
            monthOrWeek: 'month',
          },
          {
            text: '本周',
            value: [
              now.startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
              now.endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            ],
            monthOrWeek: 'week',
          },
          {
            text: '上月',
            value: [
              now
                .subtract(1, 'M')
                .startOf('M')
                .startOf('d')
                .format('YYYY-MM-DD HH:mm:ss'),
              now.subtract(1, 'M').endOf('M').endOf('d').format('YYYY-MM-DD HH:mm:ss'),
            ],
            monthOrWeek: 'month',
          },
          {
            text: '上周',
            value: [
              now
                .add(-1, 'week')
                .startOf('week')
                .add(1, 'day')
                .format('YYYY-MM-DD HH:mm:ss'),
              now
                .add(-1, 'week')
                .endOf('week')
                .add(1, 'day')
                .format('YYYY-MM-DD HH:mm:ss'),
            ],
            monthOrWeek: 'week',
          },
          {
            text: '今年',
            value: [
              now.startOf('year').startOf('d').format('YYYY-MM-DD HH:mm:ss'),
              now.endOf('year').endOf('d').format('YYYY-MM-DD HH:mm:ss'),
            ],
            monthOrWeek: 'year',
          },
        ],
      });
    },
  },
});
