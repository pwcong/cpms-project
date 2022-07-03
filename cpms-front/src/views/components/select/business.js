import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

import api from "@/api";

export default buildPropsHOC(
  {
    props: {
      agencyCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      agencyCode() {
        this.onRefresh();
      },
    },
  },
  "select-business",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.basedata
          .getBusinessList({
            limit: 200,
            pageNo: 1,
            fdBusinessName: query.keyword,
            fdAgencyCode: _.agencyCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdBusinessName,
                value: d.fdBusinessCode,
              })),
            };
          });
      },
    },
  }
);
