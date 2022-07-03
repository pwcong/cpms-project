import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(buildSelectBase(), "select-project-status", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return api.business.getProjectStatus({}).then((data) => {
        return {
          data: Object.keys(data).map((k) => ({
            text: data[k],
            value: k,
          })),
        };
      });
    },
  },
});
