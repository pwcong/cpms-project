import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    mixins: [buildSelectBase()],
    props: {
      crmCode: {
        type: String,
      },
    },
    watch: {
      crmCode() {
        this.onRefresh();
      },
    },
  },
  'select-product-line',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        if (!_.crmCode) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.order.getCRMCustomerProductLine(_.crmCode).then((data) => {
          return {
            data: data.map((d) => ({
              ...d,
              text: d.productFamilyName,
              value: d.productFamilyId,
            })),
          };
        });
      },
    },
  }
);
