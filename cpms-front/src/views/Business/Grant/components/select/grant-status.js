import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import api from "@/api";

export default buildPropsHOC(buildSelectBase(), "select-grant-status", {
    getOptions: {
        type: Function,
        default: (_, query) => {
            return api.grant
                .getProjectGrantState()
                .then((res) => {
                    return {
                        data: (res || []).map((d) => (
                            {
                                text: d.name || "<暂无名称>",
                                value: d.code,
                            })),
                    };
                });
        },
    },
});
