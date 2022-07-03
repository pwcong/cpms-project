import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectionBase(), 'selection-rate', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: Array.from(new Array(10)).map((_, i) => ({
          text: `${(i + 1) * 10}%`,
          value: (i + 1) * 10,
        })),
      });
    },
  },
});
