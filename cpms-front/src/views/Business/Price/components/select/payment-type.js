import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-payment-type", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "到付",
            value: "到付",
          },
          {
            text: "转账",
            value: "转账",
          },
        ],
      });
    },
  },
});
