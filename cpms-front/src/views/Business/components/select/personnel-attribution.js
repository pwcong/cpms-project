import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(
  buildSelectBase(),
  "select-personnel-attribution",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return Promise.resolve({
          data: [
            {
              text: "代理商",
              value: "代理商",
            },
            {
              text: "终端客户",
              value: "终端客户",
            },
          ],
        });
      },
    },
  }
);
