import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-yes-or-no", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "是",
            value: "1",
          },
          {
            text: "否",
            value: "0",
          },
        ],
      });
    },
  },
});
