import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(
  {
    props: {
      queryType: String,
    },
    mixins: [buildSelectBase()],
    watch: {
      queryType() {
        this.onRefresh();
      },
    },
  },
  "select-clue",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.clue
          .getMyClueList({
            limit: 200,
            pageNo: 1,
            keyword: query.keyword,
            queryType: _.queryType,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdClueName,
                value: d.id,
                data: d,
              })),
            };
          });
      },
    },
  }
);
