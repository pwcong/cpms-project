import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      saleOfficeCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      saleOfficeCode() {
        this.onRefresh();
      },
    },
  },
  'select-salesman-list',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { saleOfficeCode } = _;

        if (!saleOfficeCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.order.getSalesmanList(saleOfficeCode).then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: d.fdSalesMan,
              value: d.fdSalesManId,
            })),
          };
        });
      },
    },
  }
);
