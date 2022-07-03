<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
              <p-breadcrumb-item>周报管理</p-breadcrumb-item>
              <p-breadcrumb-item>周报详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | formatStatus }}
            </status-seal>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleEdit(formData.id)"
              v-if="formData.fdStatus == 'draft' || formData.fdStatus == 'reject'"
            >
              编辑
            </p-button>
            <p-button @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block style="margin-top: 16px" theme="primary">
          <p-row :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="所在周">
                <p-input
                  read-only
                  :value="`${formData.fdYear || '-'} 年第 ${
                    formData.fdWeek || '-'
                  } 周（${(formData.fdBeginTime || '').slice(0, 10)} ~ ${(
                    formData.fdEndTime || ''
                  ).slice(0, 10)}）`"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block title="本周统计" style="margin-top: 16px" theme="primary">
          <week-info style="margin-top: 16px" :value="formData" />
          <system-data :value="formData" style="margin-top: 16px" />
        </block>

        <block title="本周总结" style="margin-top: 32px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="12">
              <p-form-model-item label="本周重点工作完成情况">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdMonthPerformance"
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="本周目标达成情况">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdWeeklySituation"
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="重大项目进展">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdProjectProgress"
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="所需支持">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdNeedHelp"
                  read-only
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <sales-list readOnly style="margin-top: 32px" v-model="formData" />

        <self-list readOnly style="margin-top: 32px" v-model="formData" />

        <visit-list style="margin-top: 16px" readOnly v-model="formData" />

        <block style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="下周重点工作事项">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdNextweekEvents"
                  read-only
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <p-tabs
          style="
            margin-top: 16px;
            padding: 12px 16px;
            box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2);
          "
        >
          <p-tab-pane key="1" tab="审批信息">
            <audit-info readOnly :moduleId="id" moduleFlag="cpms_sperson_weekly" />
          </p-tab-pane>
          <p-tab-pane key="2" tab="审批记录">
            <audit-record readOnly :moduleId="id" moduleFlag="cpms_sperson_weekly" />
          </p-tab-pane>
        </p-tabs>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import WeekInfo from '../WeeklyEdit/week-info';
import SystemData from '../WeeklyEdit/system-data';
import VisitList from '../WeeklyEdit/visit-list';
import formMixin from '../WeeklyEdit/form';
import SalesList from '../WeeklyEdit/sales-list';
import SelfList from '../WeeklyEdit/self-list';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';

export default {
  name: '周报详情',
  mixins: [formMixin],
  components: {
    WeekInfo,
    SystemData,
    VisitList,
    SalesList,
    SelfList,
    AuditRecord,
    AuditInfo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
  filters: {
    formatStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '驳回';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
