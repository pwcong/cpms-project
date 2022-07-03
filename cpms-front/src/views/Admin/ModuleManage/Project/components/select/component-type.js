import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectBase(), 'select-component-type', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.business.getProjectComponentType({}).then((res) => {
        return {
          data: Object.keys(res).map((k) => ({
            text: res[k],
            value: k,
          })),
        };
      });
    },
  },
});
