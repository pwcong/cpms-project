<template>
  <block theme="primary" title="项目信息">
    <div class="table">
      <div class="table-main">
        <table v-if="projectList.length > 0">
          <thead>
            <th>序号</th>
            <th>项目名称</th>
            <th>项目类型</th>
            <th>产品线</th>
            <th>所属行业</th>
            <th>项目总金额(元)</th>
            <th>预计成交把握</th>
            <th>创建时间</th>
            <th>状态</th>
            <th>操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in projectList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdName }}</td>
              <td>{{ item.fdProjectTypeName }}</td>
              <td>{{ item.productLineName }}</td>
              <td>
                <dict-text :value="(item.fdBusinessCode || '').split(',')" systemCode="cpms" dictCode="cpms_business" />
              </td>
              <td>{{ formatAmount(item.fdProjectSum) }}</td>
              <td>{{ item.fdSuccessRate }} %</td>
              <td>{{ formatDateTime(item.fdCreateTime) }}</td>
              <td>{{ item.fdProjectStatus | foramtStatus }}</td>
              <td @click="handleDetail(item)" style="color: #e50113">详情</td>
            </tr>
          </tbody>
        </table>
        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>
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
      active: 2,
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

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
