import { buildSelectBase } from '@/components/select-base';
import { buildPropsHOC } from '@/utils/hoc';
import dayjs from 'dayjs';
const now = dayjs();
export default buildPropsHOC(buildSelectBase(), 'manager-report-salesman', {
  getOptions: {
    type: Function,
    default: (_, query) => {
      return Promise.resolve({
        data: [
          {
            value: 'custNewCreateCount',
            text: '意向客户新增',
          },
          {
            value: 'changedCount',
            text: '线索转项目',
          },
          {
            value: 'projectNewCount',
            text: '项目新增',
          },
          {
            value: 'projectNewSum',
            text: '项目新增金额',
          },
          {
            value: 'validVisitCount',
            text: '有效拜访',
          },
          {
            value: 'validClueFollowCount',
            text: '有效跟进线索',
          },
        ],
      });
    },
  },
});
