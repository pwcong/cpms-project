import api from '@/api';
import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';

export default buildPropsHOC(
  {
    props: {
      agencyCode: {
        type: String,
      },
    },
    mixins: [buildSelectBase()],
    watch: {
      agencyCode() {
        this.onRefresh();
      },
    },
  },
  'report-selection-business',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        return api.report
          .getReportDeptConfig({
            limit: 100,
            pageNo: 1,
            fdDeptName: query.keyword,
            fdAgencyCode: _.agencyCode,
          })
          .then((res) => {
            return {
              ...res,
              data: (res.data || []).map((d) => ({
                ...d,
                text: d.fdDeptName,
                value: d.fdDeptCode,
              })),
            };
          });
      },
    },
  }
);
