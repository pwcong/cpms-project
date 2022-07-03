import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      saleCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      saleCode() {
        this.onRefresh();
      },
    },
  },
  'select-secondary-channel',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { saleCode } = _;

        if (!saleCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.customer.getNextLevelChannel(saleCode).then((res) => {
          return {
            ...res,
            data: (res || []).map((d) => ({
              ...d,
              text: d.fdChannelName,
              value: d.fdChannelCode,
            })),
          };
        });
      },
    },
  }
);
