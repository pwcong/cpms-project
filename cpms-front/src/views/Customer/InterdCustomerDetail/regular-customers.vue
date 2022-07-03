<template>
  <block title="SAP客户信息" theme="primary">
    <p-table
      style="margin-top: 16px"
      :columns="[
        {
          title: '客户名称',
          dataIndex: 'fdSapCustName',
        },
        {
          title: '客户编码',
          dataIndex: 'fdSapNumber',
        },
        {
          title: '增值税登记号',
          dataIndex: 'fdSapUnifiedCode',
        },
        {
          title: '业务员',
          dataIndex: 'fdUserName',
        },
        {
          title: '省市县信息',
          dataIndex: 'fdSapAddress',
          scopedSlots: { customRender: 'fdSapAddress' },
        },
        {
          title: '是否代理商',
          dataIndex: 'fdAgent',
          scopedSlots: { customRender: 'fdAgent' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 140,
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ]"
      :data-source="custInfo"
      :pagination="false"
      bordered
    >
      <template slot="fdSapAddress" slot-scope="text, record">
        {{ record.fdSapProvince ? record.fdSapProvince + '-' : ''
        }}{{ record.fdSapCity ? record.fdSapCity + '-' : '' }}
        {{ record.fdSapCounty ? record.fdSapCounty : '' }}
      </template>
      <template slot="fdAgent" slot-scope="text">
        {{ text | IsAgent }}
      </template>
      <template slot="operation">
        <span>
          <p-button-link @click="handleDeatil()">详情</p-button-link>
        </span>
      </template>
    </p-table>
  </block>
</template>
<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'regular-customers',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  filters: {
    IsAgent(v) {
      switch (v) {
        case '10A':
          return '代理商';
        default:
          return '/';
      }
    },
  },
  data() {
    return {
      custInfo: [],
    };
  },
  async created() {
    try {
      const sapCustId = await api.customer.getCustSapCustomerId(this.moduleId);
      sapCustId.map(async (d) => {
        const sapCustInfo = await api.customer.getCustSapMain(d);
        this.custInfo = [...this.custInfo, sapCustInfo];
      });
    } finally {
    }
  },
  methods: {
    handleDeatil() {
      this.$router.push({
        path: `/Customer/SAPCustomerDetail/${this.custInfo[0].id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
