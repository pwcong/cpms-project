import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectBase(), 'select-clue-status', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            value: 'draft',
            text: '暂存',
          },
          {
            value: 'todo',
            text: '待处理',
          },
          {
            value: 'follow',
            text: '跟进中',
          },
          {
            value: 'discard',
            text: '已作废',
          },
          {
            value: 'changing',
            text: '转化中',
          },
          {
            value: 'changed',
            text: '已转化',
          },
        ],
      });
    },
  },
});
