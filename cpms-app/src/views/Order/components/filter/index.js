import dayjs from 'dayjs';
import { buildPropsHOC } from '@/utils';
import FilterBase from '@/components/filter-base';
import selectionEnumList from '@/views/Order/components/selection/enum-list';
import selectionProductLine from '@/views/components/selection/product-line';
import selectionOrderSplitStatus from '@/views/Order/components/selection/order-split-status';
import selectionProduct from '@/views/components/selection/product';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

export default buildPropsHOC(
  {
    components: {
      selectionEnumList,
      selectionProductLine,
      selectionOrderSplitStatus,
      selectionProduct,
    },
    mixins: [FilterBase],
  },
  'page-filter',
  {
    options: {
      type: Array,
      default: () => [
        {
          key: 'fdProjectName',
          label: '项目名称',
          type: 'input',
        },
        {
          key: 'fdStatus',
          label: '单据状态',
          type: 'selection',
          component: 'selection-order-split-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {},
        },
        {
          key: 'fdBillCreateDateParam',
          label: '开单时间',
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
          key: 'fdBusiness',
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
          key: 'fdNumber',
          label: '单据编号',
          type: 'input',
        },
        {
          key: 'fdOrderByList',
          label: '单据列表',
          type: 'selection',
          component: 'selection-enum-list',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {},
        },
        {
          key: 'arkOrderStatusList',
          label: '子单状态',
          type: 'selection',
          component: 'selection-order-split-status',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {},
        },
        {
          key: 'fdProductLineName',
          label: '产品线',
          type: 'selection',
          component: 'selection-product-line',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            // searchable: true,
            // fdProductLineName: query.keyword,
          },
        },
        {
          key: 'fdProductCode',
          label: '产品编码',
          type: 'selection',
          component: 'selection-product',
          getText: (v) => (v || []).map((d) => d.text).join(';'),
          props: {
            // searchable: true,
          },
        },
      ],
    },
  }
);

export function convertFilter2Query(filter) {
  const {
    fdProjectName = '',
    fdNumber = '',
    fdStatus = [],
    fdBusiness = [],
    fdOrderByList = [],
    arkOrderStatusList = [],
    fdProductLineName = [],
    fdProductCode = [],
    createTime = [],
    fdBillCreateDateParam = [],
  } = filter || {};

  const query = {
    fdNumber: fdNumber,
    fdProjectName: fdProjectName,
    fdStatus: (fdStatus || {}).map((d) => d.value).join(','),
    fdBusiness: (fdBusiness[0] || {}).value,
    fdOrderByList: (fdOrderByList[0] || {}).value,
    arkOrderStatusList: (arkOrderStatusList[0] || {}).value,
    fdProductLineName: (fdProductLineName[0] || {}).value,
    fdProductCode: (fdProductCode[0] || {}).value,
  };

  if (!!createTime[0] && !!createTime[1]) {
    query['createStartTimeParam'] = `${dayjs(createTime[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['createEndTimeParam'] = `${dayjs(createTime[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  if (!!fdBillCreateDateParam[0] && !!fdBillCreateDateParam[1]) {
    query['updateStartTimeParam'] = `${dayjs(fdBillCreateDateParam[0]).format('YYYY-MM-DD')} 00:00:00`;
    query['updateEndTimeParam'] = `${dayjs(fdBillCreateDateParam[1]).format('YYYY-MM-DD')} 23:59:59`;
  }

  return query;
}
