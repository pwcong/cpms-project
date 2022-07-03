import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import { userMixin } from '@/mixins';
import api from '@/api';
import config from '@/config';

export default buildPropsHOC(
  {
    props: {
      sapCompanyCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase(), userMixin],
    watch: {
      sapCompanyCode() {
        this.onRefresh();
      },
    },
  },
  'select-sap-sale',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { sapCompanyCode } = _;
        if (!sapCompanyCode) {
          return Promise.resolve({
            data: [],
          });
        }
        return api.basedata
          .getSapSale({
            userId: _.user.uid,
            size: 20,
            page: 1,
            sapCompanyCode,
            keyword: query.keyword,
          })
          .then((res) => {
            return {
              data: (res || []).map((d) => ({
                text: d.partyName,
                value: d.partyId,
              })),
            };
          });
      },
    },
  }
);
