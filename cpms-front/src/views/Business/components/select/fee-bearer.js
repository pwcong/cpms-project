import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-product-cate", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "我方承担",
            value: "我方承担",
          },
          {
            text: "甲方承担",
            value: "甲方承担",
          },
        ],
      });
    },
  },
});
