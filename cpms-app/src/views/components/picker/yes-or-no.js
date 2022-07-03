import { Picker } from 'vant';
import { buildPropsHOC } from '@/utils';

const options = [
  {
    value: '1',
    text: '是',
  },
  {
    value: '0',
    text: '否',
  },
];

export default buildPropsHOC(Picker, 'picker-yes-or-no', {
  columns: {
    type: Array,
    default: () => options,
  },
});
