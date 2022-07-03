import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-seal-type", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "公章",
            value: "公章",
          },
          {
            text: "财务章",
            value: "财务章",
          },
        ],
      });
    },
  },
});
