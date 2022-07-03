import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(
  {
    props: {
      type: {
        type: Number,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      type() {
        this.onRefresh();
      },
    },
  },
  "select-project-type",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { type } = _;
        return (type === 1
          ? api.business.getNewProjectTypeList
          : api.business.getProjectTypeList)({
          limit: 200,
          pageNo: 1,
          fdName: query.keyword,
        }).then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: d.fdName,
              label: `${d.fdName} ${d.fdVersion}`,
              value: d.id,
              data: d,
            })),
          };
        });
      },
    },
  }
);
