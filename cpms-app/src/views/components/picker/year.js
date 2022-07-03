import { Picker } from 'vant';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(Picker, 'picker-year', {
  columns: {
    type: Array,
    default: () =>
      Array.from(new Array(50)).map((_, i) => ({
        text: `${2020 + i}`,
        value: `${2020 + i}`,
      })),
  },
});
