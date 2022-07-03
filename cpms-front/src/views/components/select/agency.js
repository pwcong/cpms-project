import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

import api from "@/api";

export default buildPropsHOC(
  {
    mixins: [buildSelectBase()],
  },
  "select-agency",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        
        return api.basedata
          .getAgencyList({
            limit: 200,
            pageNo: 1,
            fdName: query.keyword,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdName,
                value: d.fdCode,
              })),
            };
          });
      },
    },
  }
);
