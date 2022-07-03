import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import api from '@/api';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {},
    mixins: [FilterBase],
  },
  'page-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdCustType',
          label: '客户类型',
          type: 'selection',
          component: 'selection-dict',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            systemCode: 'cpms',
            dictCode: 'cpms_cust_type',
          },
        },
        {
          key: 'fdCustIndustry',
          label: '所属行业',
          type: 'selection',
          component: 'selection-dict',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            systemCode: 'cpms',
            dictCode: 'cpms_business',
          },
        },
        {
          key: 'fdStatus',
          label: '客户状态',
          type: 'selection',
          component: '',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            getOptions: () => {
              return api.customer
                .getCustomerStatus({
                  limit: 999,
                  pageNo: 1,
                })
                .then((res) => {
                  return {
                    ...res,
                    data: (res.data || []).map((d) => ({
                      text: d.value,
                      value: d.key,
                    })),
                  };
                });
            },
            multiple: true,
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
        {
          key: 'updateTime',
          label: '更新时间',
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

export function convertFilter2Query(filter) {
  const { fdCustType = [], fdCustIndustry = [], fdStatus = [], createTime = [], updateTime = [] } = filter || {};

  const query = {
    fdCustType: (fdCustType[0] || {}).value,
    fdCustIndustry: (fdCustIndustry[0] || {}).value,
    fdStatus: (fdStatus || {}).map((d) => d.value).join(','),
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['createStartTimeParam'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['createEndTimeParam'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  if (!!updateTime[0] && !!updateTime[1]) {
    query['updateStartTimeParam'] = `${dayjs(updateTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['updateEndTimeParam'] = `${dayjs(updateTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
