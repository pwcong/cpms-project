import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-guest-relationship", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "未知",
            value: "未知",
          },
          {
            text: "很差",
            value: "很差",
          },
          {
            text: "较差",
            value: "较差",
          },
          {
            text: "一般",
            value: "一般",
          },
          {
            text: "较好",
            value: "较好",
          },
          {
            text: "很好",
            value: "很好",
          },
        ],
      });
    },
  },
});
