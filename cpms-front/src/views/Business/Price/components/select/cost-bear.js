import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-cost-bear", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "客户承担",
            value: "客户承担",
          },
          {
            text: "我方承担",
            value: "我方承担",
          },
        ],
      });
    },
  },
});
