import api from '@/api';
import {
  buildSelectionBase
} from '@/components/selection-base';
import {
  buildPropsHOC
} from '@/utils';

export default buildPropsHOC({
    mixins: [buildSelectionBase()],
  },
  'selection-tianyancha', {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return !!query.keyword ? api.common.getTianyanchaList(query.keyword).then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              ...d,
              text: d.name,
              value: d.name,
            })),
          };
        }) : Promise.resolve({
          data: [],
        })
      },
    },
  }
);
