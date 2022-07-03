import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectionBase(), 'selection-role', {
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
            text: '使用者',
            value: '使用者',
          },
          {
            text: '评估者',
            value: '评估者',
          },
          {
            text: '决策者',
            value: '决策者',
          },
          {
            text: '审批者',
            value: '审批者',
          },
        ],
      });
    },
  },
});
