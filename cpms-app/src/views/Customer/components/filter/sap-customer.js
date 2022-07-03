import api from '@/api';
import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import SelectionProvince from '../selection/sap-province';
import SelectionCity from '../selection/sap-city';
import SelectionCounty from '../selection/sap-county';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      SelectionProvince,
      SelectionCity,
      SelectionCounty,
    },
    mixins: [FilterBase],
  },
  'page-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdSapNumber',
          label: '客户编码',
          type: 'input',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdSapUnifiedCode',
          label: '增值税登记号',
          type: 'input',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
        },
        {
          key: 'fdUserName',
          label: '业务员',
          type: 'input',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
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
        {
          key: 'fdSapProvinceCode',
          label: '所属省',
          type: 'selection',
          component: 'selection-province',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          events(_) {
            return {
              change: function () {
                _.tempValue.fdSapCityCode = [];
                _.tempValue.fdSapCountyCode = [];
              },
            };
          },
        },
        {
          key: 'fdSapCityCode',
          label: '所属市',
          type: 'selection',
          component: 'selection-city',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          events(_) {
            return {
              change: function () {
                _.tempValue.fdSapCountyCode = [];
              },
            };
          },
          props(_) {
            return {
              provinceCode: ((_.tempValue.fdSapProvinceCode || {})[0] || {}).value,
            };
          },
        },
        {
          key: 'fdSapCountyCode',
          label: '所属区',
          type: 'selection',
          component: 'selection-county',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props(_) {
            return {
              cityCode: ((_.tempValue.fdSapCityCode || {})[0] || {}).value,
            };
          },
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const {
    fdSapNumber = '',
    fdSapUnifiedCode = '',
    fdUserName = '',
    createTime = [],
    fdSapProvinceCode = [],
    fdSapCityCode = [],
    fdSapCountyCode = [],
  } = filter || {};

  const query = {
    fdSapNumber: fdSapNumber,
    fdSapUnifiedCode: fdSapUnifiedCode,
    fdUserName: fdUserName,
    fdSapProvinceCode: (fdSapProvinceCode[0] || {}).value,
    fdSapCityCode: (fdSapCityCode[0] || {}).value,
    fdSapCountyCode: (fdSapCountyCode[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['createStartTimeParam'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['createEndTimeParam'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
