import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(
  {
    props: {
      type: {
        type: Number,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      type() {
        this.onRefresh();
      },
    },
  },
  'selection-project-type',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { type } = _;
        return (type === 1
          ? api.business.getNewProjectTypeList
          : api.business.getProjectTypeList)({
          limit: 100,
          pageNo: 1,
          fdName: query.keyword,
        }).then((res) => {
          return {
            ...res,
            data: (res.data || []).map((d) => ({
              text: `${d.fdName} ${d.fdVersion}`,
              value: d.id,
              data: d,
            })),
          };
        });
      },
    },
  }
);
