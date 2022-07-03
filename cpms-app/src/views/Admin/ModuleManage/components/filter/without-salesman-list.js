import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionProvince from '@/views/components/selection/province';
import SelectionCity from '@/views/components/selection/city';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionProvince,
      SelectionCity,
    },
    mixins: [FilterBase],
  },
  'without-salesman-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdCustCode',
          label: '客户编码',
          type: 'input',
        },
        {
          key: 'fdUnifiedCode',
          label: '社会统一信用编码',
          type: 'input',
        },
        {
          key: 'fdPerson',
          label: '业务员',
          type: 'input',
        },
        {
          key: 'fdProvinceCode',
          label: '省',
          type: 'selection',
          component: 'selection-province',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          events(_) {
            return {
              change: function () {
                _.tempValue.fdCityCode = [];
              },
            };
          },
        },
        {
          key: 'fdCityCode',
          label: '市',
          type: 'selection',
          component: 'selection-city',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props(_) {
            return {
              provinceCode: ((_.tempValue.fdProvinceCode || {})[0] || {}).value,
            };
          },
        },
        {
          key: 'createTime',
          label: '创建时间',
          type: 'calendar',
          getText: (v) => {
            if (!v || !v[0] || !v[1]) {
              return '';
            }
            return `${dayjs(v[0]).format('YYYY-MM-DD')} ~ ${dayjs(v[1]).format('YYYY-MM-DD')}`;
          },
          props: {
            type: 'range',
            minDate: CALENDAR_MIN_DATE,
            maxDate: CALENDAR_MAX_DATE,
          },
        },
      ],
    },
  }
);
``;
export function convertFilter2Query(filter) {
  const { createTime = [], fdUnifiedCode, fdPerson, fdCustCode, fdProvinceCode = [], fdCityCode = [] } = filter || {};

  const query = {
    fdUnifiedCode,
    fdPerson,
    fdCustCode,
    fdProvinceCode: (fdProvinceCode[0] || {}).value,
    fdCityCode: (fdCityCode[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['createStartTime'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['createEndTime'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
