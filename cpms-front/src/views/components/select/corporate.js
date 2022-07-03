import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(buildSelectBase(), "select-corporate", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.basedata
        .getCorporateList({
          limit: 200,
          pageNo: 1,
          fdCorporateName: query.keyword,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              ...d,
              text: `${d.fdCorporateName}`,
              value: d.fdCorporateCode,
              data: d,
            })),
          };
        });
    },
  },
});
