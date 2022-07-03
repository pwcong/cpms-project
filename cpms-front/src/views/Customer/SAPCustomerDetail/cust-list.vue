<template>
  <block title="关联客户信息" theme="primary">
    <template v-slot:action> </template>

    <p-table
      :scroll="{ x: true }"
      :rowKey="
        (row, index) => {
          return index;
        }
      "
      style="margin-top: 16px"
      :pagination="false"
      :columns="
        [
          {
            title: '序号',
            width: 50,
            fixed: 'left',
            dataIndex: 'index',
            customRender: (text, record, index) => `${index + 1}`,
          },
          {
            title: '客户名称',
            dataIndex: 'fdCustName',
          },
          {
            title: '所属行业',
            dataIndex: 'fdCustIndustry',
            scopedSlots: { customRender: 'fdCustIndustry' },
          },
          {
            title: '客户类型',
            dataIndex: 'fdCustType',
            scopedSlots: { customRender: 'fdCustType' },
          },
          {
            title: '经营状态',
            dataIndex: 'fdCustManageforms',
          },
          {
            title: '创建人',
            dataIndex: 'createByName',
          },
          {
            title: '名下项目数',
            dataIndex: 'fdProjectCount',
            scopedSlots: { customRender: 'fdProjectCount' },
          },
          {
            title: '最新更新时间',
            dataIndex: 'updateTime',
            customRender: (text, record) => formatDateTime(record.updateTime),
          },
          {
            title: '申请单状态',
            dataIndex: 'fdStatus',
            fixed: 'right',
            width: 100,
            align: 'center',
            scopedSlots: { customRender: 'fdStatus' },
          },
        ].concat(
          !!readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  fixed: 'right',
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="relatedCustList"
      bordered
    >
      <template slot="fdCustIndustry" slot-scope="text, record">
        <dict-text
          :value="(record.fdCustIndustry || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_business"
        />
      </template>
      <template slot="fdCustType" slot-scope="text, record">
        <dict-text
          :value="(record.fdCustType || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_cust_type"
        />
      </template>
      <template slot="fdStatus" slot-scope="text">
        {{ text | foramtStatus }}
      </template>
      <template slot="fdProjectCount" slot-scope="text, record">
        <div :title="text" @click="handleProjectList(record)">
          <p-button-link style="color: #040c2c">{{ text || '0' }}</p-button-link>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleDeatil(record, index)"> 详情 </p-button-link>
        </span>
      </template>
    </p-table>
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'cust-list',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {},
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        default:
          return v;
      }
    },
  },
  data() {
    return {
      relatedCustList: [],
    };
  },
  async created() {
    if (!!this.moduleId) {
      const relatedCustList = await api.customer.getRelatedCust(this.moduleId);
      this.relatedCustList = [relatedCustList];
    }
  },
  methods: {
    handleDeatil(record) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${record.id}`,
      });
    },
  },
};
</script>
