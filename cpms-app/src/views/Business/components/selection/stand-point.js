import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectionBase(), 'selection-stand-point', {
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
            text: '反对',
            value: '反对',
          },
          {
            text: '不支持',
            value: '不支持',
          },
          {
            text: '中立',
            value: '中立',
          },
          {
            text: '支持',
            value: '支持',
          },
          {
            text: '其他',
            value: '其他',
          },
        ],
      });
    },
  },
});
