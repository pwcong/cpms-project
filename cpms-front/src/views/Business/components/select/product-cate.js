import { buildSelectBase } from "@/components/select-base";
import { buildPropsHOC } from "@/utils/hoc";

export default buildPropsHOC(
  {
    props: {
      noDIY: Boolean,
    },
    mixins: [buildSelectBase()],
    watch: {
      noDIY() {
        this.onRefresh();
      },
    },
  },
  "select-product-cate",
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return Promise.resolve({
          data: [
            {
              text: "标准产品",
              value: "标准产品",
            },
            {
              text: "标准产品定制化",
              value: "标准产品定制化",
            },
          ].concat(
            _.noDIY
              ? []
              : [
                  {
                    text: "完全定制化",
                    value: "完全定制化",
                  },
                ]
          ),
        });
      },
    },
  }
);
