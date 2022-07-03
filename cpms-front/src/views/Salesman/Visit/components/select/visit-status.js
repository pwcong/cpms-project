import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-visit-status", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            value: "draft",
            text: "暂存",
          },
          {
            value: "todo",
            text: "有效",
          }
        ],
      });
    },
  },
});
