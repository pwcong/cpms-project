import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import api from '@/api';

export default buildPropsHOC(
  {
    props: {
      typeCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      typeCode() {
        this.onRefresh();
      },
    },
  },
  'select-rule-type',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        if (!_.typeCode) {
          return Promise.resolve;
        }
        return api.common.getRuleType(_.typeCode).then((res) => {
          return {
            data: (res || []).map((d) => ({
              text: d.fdName,
              value: d.fdCode,
            })),
          };
        });
      },
    },
  }
);
