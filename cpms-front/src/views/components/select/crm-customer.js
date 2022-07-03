import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      customerId: {
        type: String,
      },
      branchCode: {
        type: String,
      },
      deptCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      customerId() {
        this.onRefresh();
      },
      branchCode() {
        this.onRefresh();
      },
      deptCode() {
        this.onRefresh();
      },
    },
  },
  'select-crm-customer',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { customerId, branchCode, deptCode } = _;

        if (!customerId) {
          return Promise.resolve({
            data: [],
          });
        }

        return api.price
          .getCrmCust({
            limit: 200,
            pageNo: 1,
            fdCustMainId: customerId,
            fdBranchCompanyCode: branchCode,
            fdSaleDeptCode: deptCode,
          })
          .then((res) => {
            return {
              data: (res || []).map((d) => ({
                ...d,
                text: d.fdSapCustName,
                value: d.fdSapCustCode,
                label: `${d.fdSapCustName}(${d.fdChannelOneName}/${d.fdChannelTwoName})`,
                data: d,
              })),
            };
          });
      },
    },
  }
);
