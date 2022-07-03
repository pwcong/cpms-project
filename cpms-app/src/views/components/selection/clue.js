import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      queryType: {
        type: String,
      },
    },
    mixins: [buildSelectionBase()],
    watch: {
      queryType() {
        this.onRefresh();
      },
    },
  },
  'selection-clue',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.clue
          .getMyClueList({
            limit: 100,
            pageNo: 1,
            keyword: query.keyword,
            queryType: _.queryType,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdClueName,
                value: d.id,
                data: d,
              })),
            };
          });
      },
    },
  }
);
