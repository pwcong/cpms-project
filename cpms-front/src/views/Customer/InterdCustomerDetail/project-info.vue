<template>
  <block title="项目信息" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      :columns="[
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '项目名称',
          dataIndex: 'fdName',
        },
        {
          title: '项目类型',
          dataIndex: 'fdProjectTypeName',
        },
        {
          title: '产品线',
          dataIndex: 'productLineName',
        },
        {
          title: '所属行业',
          dataIndex: 'fdBusinessCode',
          scopedSlots: { customRender: 'fdBusinessCode' },
        },
        {
          title: '项目总金额(元)',
          dataIndex: 'fdProjectSum',
          customRender: (text, recode) => formatAmount(text),
        },
        {
          title: '预计成交把握',
          dataIndex: 'fdSuccessRate',
          customRender: (text, record) => `${record.fdSuccessRate || '--'}%`,
        },
        {
          title: '创建时间',
          dataIndex: 'fdCreateTime',
          customRender: (text, record) => formatDateTime(record.fdCreateTime),
        },
        {
          title: '状态',
          dataIndex: 'fdProjectStatusName',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'operation' },
        },
      ]"
      :data-source="projectList"
      :pagination="false"
      bordered
    >
      <template slot="fdBusinessCode" slot-scope="text, record">
        <dict-text
          :value="(record.fdBusinessCode || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_business"
        />
      </template>
      <template slot="operation" slot-scope="text, record">
        <span>
          <p-button-link @click="handleDetail(record)"> 详情 </p-button-link>
        </span>
      </template>
      <template slot="fdStatus" slot-scope="text">
        {{ text | foramtStatus }}
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
  name: 'project-info',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: String,
  },
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
      projectList: [],
    };
  },
  async created() {
    const projectList = await api.business.getProjectList({
      isFilter: 2,
      fdCustMainId: this.moduleId,
    });
    this.projectList = projectList.data;
  },
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Business/ProjectDetail/${record.id}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
