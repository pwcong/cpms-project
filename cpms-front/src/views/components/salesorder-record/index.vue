<template>
  <block title="销售单信息" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="fdId"
      :loading="loading"
      :columns="[
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '销售单编号',
          dataIndex: 'fdNumber',
        },
        {
          title: '分公司',
          dataIndex: 'fdBranchCompanyName',
        },
        {
          title: '要货客户',
          dataIndex: 'fdApplyCustomerName',
        },
        {
          title: '项目名称',
          dataIndex: 'fdProjectName',
        },
        {
          title: '合计金额',
          dataIndex: 'fdTotalAmount',
        },
        {
          title: '开单日期',
          dataIndex: 'fdBillCreateDate',
        },
        {
          title: '单据类型',
          dataIndex: 'fdBillType',
          scopedSlots: { customRender: 'fdBillType' },
        },
        {
          title: '状态',
          dataIndex: 'fdStatus',
          scopedSlots: { customRender: 'fdStatus' },
        },
        {
          title: '创建人',
          dataIndex: 'createByName',
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
        },
      ]"
      :data-source="list"
      bordered
      :pagination="{
        current: pageNo,
        pageSize: pageSize,
        total: totalSize,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(pageNo = $event.current) && (pageSize = $event.pageSize)"
    >
      <template slot="fdStatus" slot-scope="text, record">
        {{ record.fdStatus | foramtStatus }}
      </template>
      <template slot="fdBillType" slot-scope="text">
        <dict-text
          :value="(text || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_order_bill_type"
        />
      </template>
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin, buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const listMixin = buildListMixin({
  relation: ['moduleId', 'mainId', 'moduleFlag'],
  getData: async (_, query) => {
    // console.log('_', _);
    // console.log('query', query);
    if (!_.moduleId && !_.moduleFlag && !_.mainId) {
      return Promise.resolve({
        data: [],
      });
    }

    if (_.moduleFlag === 'cpms_project_contract_main') {
      return await api.common
        .getOrderMainFindOrderList(_.moduleId, _.mainId, 'contract')
        .then((data) => {
          return {
            data: data.map((d, i) => ({
              ...d,
              id: i,
            })),
          };
        });
    } else if (_.moduleFlag === 'cpms_project_price_main') {
      return await api.common
        .getOrderMainFindOrderList(_.moduleId, _.mainId, 'price')
        .then((data) => {
          return {
            data: data.map((d, i) => ({
              ...d,
              id: i,
            })),
          };
        });
    } else {
      return await api.common
        .getOrderMainFindOrderList(_.moduleId, _.mainId, 'project')
        .then((data) => {
          return {
            data: data.map((d, i) => ({
              ...d,
              id: i,
            })),
          };
        });
    }
  },
});

export default {
  name: 'audit-record',
  props: {
    moduleId: String,
    moduleFlag: String,
    mainId: String,
  },
  mixins: [listMixin, formatMixin, selectionMixin],
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待处理';
        case 'pushing':
          return '推送中';
        case 'complete':
          return '已完成';
        case 'draft':
          return '暂存';
        case 'error':
          return '下单异常';
        case 'ready':
          return '待发货';
        case 'part':
          return '部分发货';
        case 'invalid':
          return '已作废';
        default:
          return v;
      }
    },
  },
};
</script>
