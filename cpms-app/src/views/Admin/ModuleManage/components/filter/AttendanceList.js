import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';

import SelectionGrantStatus from '../selection/grant-status';
import SelectionCustomer from '@/views/components/selection/customer';

export default buildPropsHOC(
  {
    components: {
      SelectionGrantStatus,
      SelectionCustomer,
    },
    mixins: [FilterBase],
  },
  'attendance-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdLoginName',
          label: '打卡人',
          type: 'selection',
          component: 'selection-user',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            searchable: true,
          },
        },
        {
          key: 'fdDeptCode',
          label: '部门',
          type: 'selection',
          component: 'selection-org',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            searchable: true,
          },
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const { fdLoginName = [], fdDeptCode = [] } = filter || {};

  const query = {
    fdLoginName: (fdLoginName[0] || {}).uid,
    fdDeptCode: (fdDeptCode[0] || {}).code,
  };

  return query;
}
