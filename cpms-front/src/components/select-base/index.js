import { buildListMixin } from "@/mixins";
import SelectBase from "./index.vue";

export function buildSelectBase() {
  const listMixin = buildListMixin({
    properties: ["keyword"],
    getDataPropName: "getOptions",
  });

  return {
    name: "select-base",
    mixins: [listMixin, SelectBase],
  };
}
