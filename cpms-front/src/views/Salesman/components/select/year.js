import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-year", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: Array.from(new Array(50)).map((_, i) => ({
          text: `${2020 + i}年`,
          value: `${2020 + i}`,
        })),
      });
    },
  },
});
