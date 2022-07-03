import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";
import { getWeeksOfYear } from "@/utils/date";
import dayjs from "dayjs";

export default buildPropsHOC(
  {
    props: {
      year: {
        String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      year() {
        this.onRefresh();
      },
    },
  },
  "select-week",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { year } = _;

        return Promise.resolve({
          data: getWeeksOfYear(year || dayjs().year()).map((d, i) => ({
            text: `第${i + 1}周(${d.start.format(
              "YYYY-MM-DD"
            )} ~ ${d.end.format("YYYY-MM-DD")})`,
            value: `${i + 1}`,
          })),
        });
      },
    },
  }
);
