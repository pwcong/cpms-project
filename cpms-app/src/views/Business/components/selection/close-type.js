import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import { buildDynamicText } from '@/components/dynamic-text';

function getData() {
  return Promise.resolve({
    data: [
      {
        text: '已成交',
        value: 'done',
      },
      {
        text: '已丢单',
        value: 'lost',
      },
    ],
  });
}

export default buildPropsHOC(buildSelectionBase(), 'selection-close-type', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return getData();
    },
  },
});

export const CloseTypeText = buildDynamicText('close-type-text', {
  getData: (_, value) => {
    return getData().then((res) => res.data);
  },
});
