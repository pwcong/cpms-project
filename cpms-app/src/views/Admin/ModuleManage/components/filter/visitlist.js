import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';

export default buildPropsHOC(
  {
    components: {},
    mixins: [FilterBase],
  },
  'visit-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdVisitName',
          label: '拜访人',
          type: 'input',
        },
        {
          key: 'fdModuleType',
          label: '拜访名称',
          type: 'input',
        },
        {
          key: 'fdVisitAddress',
          label: '拜访地址',
          type: 'input',
        },
        {
          key: 'fdVisitType',
          label: '拜访类型',
          type: 'selection',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            options: [
              {
                value: 'cust',
                text: '客户拜访',
              },
              {
                value: 'clue',
                text: '线索拜访',
              },
              {
                value: 'project',
                text: '项目拜访',
              },
            ],
          },
        },
        {
          key: 'fdStatus',
          label: '状态',
          type: 'selection',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            options: [
              {
                value: 'draft',
                text: '暂存',
              },
              {
                value: 'todo',
                text: '有效',
              },
            ],
          },
        },
      ],
    },
  }
);
``;
export function convertFilter2Query(filter) {
  const { fdVisitName = '', fdModuleType = '', fdVisitAddress = '', fdVisitType = [], fdStatus = [] } = filter || {};

  const query = {
    fdVisitName,
    fdModuleType,
    fdVisitAddress,
    fdVisitType: (fdVisitType[0] || {}).value,
    fdStatus: (fdStatus[0] || {}).value,
  };

  return query;
}
