import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

import api from '@/api';

export default buildPropsHOC(
  {
    mixins: [buildSelectBase()],
  },
  'select-question-status',
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
