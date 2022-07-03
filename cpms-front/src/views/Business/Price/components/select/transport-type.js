import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "select-transport-type", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "普运",
            value: "普运",
          },
          {
            text: "快运",
            value: "快运",
          },
          {
            text: "快递",
            value: "快递",
          },
          {
            text: "空运",
            value: "空运",
          },
        ],
      });
    },
  },
});
