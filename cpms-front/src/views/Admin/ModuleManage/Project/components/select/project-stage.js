import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(buildSelectBase(), 'select-project-stage', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.business
        .getProjectStageList({
          limit: 200,
          pageNo: 1,
          fdName: query.keyword,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: d.fdName,
              value: d.id,
              data: d,
            })),
          };
        });
    },
  },
});
