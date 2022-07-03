import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(buildSelectBase(), "select-clue", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.clue
        .getMyFollowAndClaimList({
          limit: 200,
          pageNo: 1,
          keyword: query.keyword,
        })
        .then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: d.fdClueName || "<暂无名称>",
              value: d.id,
              data: d,
            })),
          };
        });
    },
  },
});
