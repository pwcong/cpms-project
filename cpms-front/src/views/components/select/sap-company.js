import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import { userMixin } from '@/mixins';
import api from '@/api';
import config from '@/config';

export default buildPropsHOC(
  {
    mixins: [buildSelectBase(), userMixin],
  },
  'select-sap-company',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getSapCompany({
            userId: _.user.uid,
            keyword: query.keyword,
          })
          .then((res) => {
            return {
              data: (res || []).map((d) => ({
                ...d,
                text: `${d.sapCompanyName}`,
                value: d.sapCompanyCode,
                data: d,
              })),
            };
          });
      },
    },
  }
);
