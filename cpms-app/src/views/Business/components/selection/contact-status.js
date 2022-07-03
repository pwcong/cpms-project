import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectionBase(), 'selection-contact-status', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: '未知',
            value: '未知',
          },
          {
            text: '尚未接触',
            value: '尚未接触',
          },
          {
            text: '短暂接触',
            value: '短暂接触',
          },
          {
            text: '多次接触',
            value: '多次接触',
          },
          {
            text: '深度接触',
            value: '深度接触',
          },
        ],
      });
    },
  },
});
