import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionQuestionStatus from '@/views/Own/components/selection/question-status';

export const CALENDAR_MIN_DATE = new Date(2020, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);
const getText = (v) => {
  if (!v || !v[0] || !v[1]) {
    return '';
  }
  return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format('YYYY-MM-DD')}`;
};
export default buildPropsHOC(
  {
    components: {
      SelectionQuestionStatus,
    },
    mixins: [FilterBase],
  },
  'customer-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdMobile',
          label: '提问者手机号',
          type: 'input',
        },
        {
          key: 'fdEmail',
          label: '提问者邮箱',
          type: 'input',
        },
        {
          key: 'createTime',
          label: '创建时间',
          type: 'calendar',
          getText,
          props: {
            type: 'range',
            minDate: CALENDAR_MIN_DATE,
            maxDate: CALENDAR_MAX_DATE,
          },
        },
        {
          key: 'fdIsCommon',
          label: '是否有效',
          type: 'selection',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            options: [
              {
                value: '1',
                text: '是',
              },
              {
                value: '0',
                text: '否',
              },
            ],
          },
        },
        {
          key: 'fdStatus',
          label: '问题状态',
          type: 'selection',
          component: 'selection-question-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const { createTime = [], fdMobile = '', fdEmail = '', fdIsCommon = [], fdStatus = [] } = filter || {};

  const query = {
    fdMobile,
    fdEmail,
    fdIsCommon: (fdIsCommon[0] || {}).value,
    fdStatus: (fdStatus[0] || {}).value,
  };
  if (!!createTime[0] && !!createTime[1]) {
    query['fdDateStartTime'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['fdDateEndTime'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }
  return query;
}
