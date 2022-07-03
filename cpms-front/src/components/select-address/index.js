import axios from "axios";

import config from "@/config";
import { buildPropsHOC } from "@/utils/hoc";
import { buildSelectBase } from "@/components/select-base";

export const getOptions = (query) =>
  !!query.keyword
    ? axios
        .get(
          `https://restapi.amap.com/v3/place/text?keywords=${query.keyword}&key=${config.amapKey}`
        )
        .then((res) => res.data || {})
        .then((res) => {
          const { pois = [] } = res;
          return {
            data: pois.map((d) => ({
              ...d,
              text: `${d.pname || ""}${d.cityname || ""}${d.adname || ""}${
                d.name
              }`,
              value: d.location,
            })),
          };
        })
    : Promise.resolve({
        data: [],
      });

export default buildPropsHOC(buildSelectBase(), "select-address", {
  getOptions: {
    type: Function,
    default: (_, query) => getOptions(query),
  },
});
