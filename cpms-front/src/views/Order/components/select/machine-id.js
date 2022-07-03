import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(buildSelectBase(), 'select-machine-id', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: '正常机',
            value: '正常机',
          },
          {
            text: '特价机',
            value: '特价机',
          },
          {
            text: '工程机',
            value: '工程机',
          },
          {
            text: '包销机',
            value: '包销机',
          },
          {
            text: '惊爆机',
            value: '惊爆机',
          },
          {
            text: '高档机',
            value: '高档机',
          },
          {
            text: '低档机',
            value: '低档机',
          },
        ],
      });
    },
  },
});
