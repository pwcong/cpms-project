import { Picker } from 'vant';
import { buildDataHOC, getWeeksOfYear } from '@/utils';
import dayjs from 'dayjs';

export default buildDataHOC(Picker, 'picker-week', {
  property: 'columns',
  properties: {
    year: String,
  },
  data: [],
  getData: (_, props) => {
    return Promise.resolve(
      getWeeksOfYear(props.year || dayjs().year()).map((d, i) => ({
        text: `第${i + 1}周(${d.start.format('YYYY-MM-DD')} ~ ${d.end.format(
          'YYYY-MM-DD'
        )})`,
        value: `${i + 1}`,
      }))
    );
  },
});
