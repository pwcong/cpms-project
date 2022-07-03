import { Picker } from 'vant';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(Picker, 'picker-year', {
  columns: {
    type: Array,
    default: () =>
      Array.from(new Array(12)).map((_, i) => ({
        text: `${i + 1}`,
        value: `${i}`,
      })),
  },
});
