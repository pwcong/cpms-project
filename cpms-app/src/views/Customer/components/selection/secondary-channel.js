import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      saleCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      saleCode() {
        this.onRefresh();
      },
    },
  },
  'selection-secondary-channel',
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
