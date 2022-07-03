import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

import api from "@/api";

export default buildPropsHOC(
  {
    mixins: [buildSelectBase()],
  },
  "select-clockin-address",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.salesman
          .getVisitTypeClockInAddress({
            fdVisitWay: "customerVisit",
          })
          .then((data) => {
            return {
              data: (data || []).map((d) => ({
                ...d,
                text: d.fdClockAddress,
                value: d.id,
              })),
            };
          });
      },
    },
  }
);
