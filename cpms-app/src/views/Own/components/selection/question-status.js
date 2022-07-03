import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    mixins: [buildSelectionBase()],
  },
  'selection-question-status',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.common.getQuestionStatus({}).then((data) => {
          return {
            data: Object.keys(data).map((d) => ({
              text: data[d],
              value: d,
            })),
          };
        });
      },
    },
  }
);
