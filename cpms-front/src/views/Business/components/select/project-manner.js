import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-project-manner", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "客户直投",
            value: "客户直投",
          },
          {
            text: "代理商操作",
            value: "代理商操作",
          },
        ],
      });
    },
  },
});
