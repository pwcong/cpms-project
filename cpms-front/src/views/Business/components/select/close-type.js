import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-close-type", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "已成交",
            value: "done",
          },
          {
            text: "已丢单",
            value: "lost",
          },
        ],
      });
    },
  },
});
