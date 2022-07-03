import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      saleOfficeCode: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      saleOfficeCode() {
        this.onRefresh();
      },
    },
  },
  'selection-salesman-list',
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
