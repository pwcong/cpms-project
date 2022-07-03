import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';

export default buildPropsHOC(
  {
    components: {},
    mixins: [FilterBase],
  },
  'customer-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdSapCompanyName',
          label: '分公司名称',
          type: 'input',
        },
        {
          key: 'fdSaleName',
          label: '销售部名称',
          type: 'input',
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const { fdSapCompanyName = '', fdSaleName = '' } = filter || {};

  const query = {
    fdSapCompanyName,
    fdSaleName,
  };
  return query;
}
