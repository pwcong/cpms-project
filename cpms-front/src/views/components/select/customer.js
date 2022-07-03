import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(
  {
    props: {
      status: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      status() {
        this.onRefresh();
      },
    },
  },
  "select-customer",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.customer
          .getCommonCustomerList({
            limit: 200,
            pageNo: 1,
            fdCustName: query.keyword,
            fdStatus: _.status,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdCustName,
                value: d.id,
                data: d,
              })),
            };
          });
      },
    },
  }
);
