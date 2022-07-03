import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(buildSelectBase(), "weekly-status", {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            text: "暂存",
            value: "draft",
          },
          {
            text: "待审批",
            value: "todo",
          },
          {
            text: "审批中",
            value: "audit",
          },
          {
            text: "审批通过",
            value: "pass",
          },
          {
            text: "驳回",
            value: "reject",
          },
        ],
      });
    },
  },
});
