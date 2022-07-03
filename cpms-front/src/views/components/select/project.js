import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(
  {
    props: {
      customerId: {
        type: String,
      },
      validate: {
        type: Function,
        default: function() {
          return true;
        },
      },
      status: {
        type: String,
        default: "todo,audit,follow,done",
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      validate() {
        this.onRefresh();
      },
      customerId() {
        this.onRefresh();
      },
      status() {
        this.onRefresh();
      },
    },
  },
  "select-project",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.business
          .getProjectList({
            limit: 200,
            pageNo: 1,
            fdName: query.keyword,
            fdCustMainId: _.customerId,
            fdProjectStatus: _.status,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || [])
                .filter((d) => _.validate(d))
                .map((d) => ({
                  ...d,
                  text: d.fdName,
                  value: d.id,
                  data: d,
                })),
            };
          });
      },
    },
  }
);
