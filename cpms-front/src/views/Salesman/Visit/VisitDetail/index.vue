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
              <p-breadcrumb-item>拜访管理</p-breadcrumb-item>
              <p-breadcrumb-item>拜访计划详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleEdit(formData.id)"
              v-if="checkAllowEdit(formData)"
            >
              编辑
            </p-button>

            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleFeedback(formData, true)"
              v-if="formData.fdFeedbackCount > 0 && checkAllowFeedback(formData)"
            >
              编辑拜访反馈
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleFeedback(formData)"
              v-else-if="checkAllowFeedback(formData)"
            >
              新建拜访反馈
            </p-button>
            <p-button @click="handleCancel">返回</p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span>基本信息</span>
              <span
                style="font-size: 12px; color: #e50113"
                v-if="!!formData.fdRepeatPrompt"
              >
                （{{ formData.fdRepeatPrompt }}）
              </span>
            </div>
          </template>
          <template #action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="计划拜访日期" prop="fdVisitPlanBeginTime">
                <p-input
                  read-only
                  :value="`${formData.fdVisitPlanYear}年第${formData.fdVisitPlanWeek}周`"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访类型" prop="fdVisitType">
                <select-dict
                  read-only
                  :value="
                    !!formData.fdVisitType
                      ? [
                          {
                            value: formData.fdVisitType,
                          },
                        ]
                      : []
                  "
                  dictCode="cpms_visit_type"
                  systemCode="cpms"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item :label="`${moduleName}名称`" prop="fdModuleType">
                <p-input v-model="formData.fdModuleType" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访方式" prop="fdVisitWay">
                <select-dict
                  read-only
                  :value="
                    !!formData.fdVisitWay
                      ? [
                          {
                            value: formData.fdVisitWay,
                          },
                        ]
                      : []
                  "
                  dictCode="cpms_visit_way"
                  systemCode="cpms"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访地址" prop="fdVisitAddress">
                <p-input v-model="formData.fdVisitAddress" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="拜访人姓名" prop="fdVisitName">
                <p-input v-model="formData.fdVisitName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访人电话" prop="fdVisitMobile">
                <p-input v-model="formData.fdVisitMobile" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访人职务">
                <p-input v-model="formData.fdVisitJob" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="拜访目的" prop="fdVisitPurpose">
                <p-textarea
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdVisitPurpose"
                  read-only
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <clock-list style="margin-top: 16px" readOnly v-model="formData" />
        <feedback-list style="margin-top: 16px" readOnly v-model="formData" />
        <project-list
          v-if="formData.fdVisitType === 'cust'"
          style="margin-top: 16px"
          readOnly
          v-model="formData"
        />
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import ClockList from './clock-list';
import ProjectList from './project-list';
import FeedbackList from './feedback-list';
import formMixin from '../VisitEdit/form';
import dayjs from 'dayjs';
export default {
  name: '拜访计划详情',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  components: {
    ClockList,
    FeedbackList,
    ProjectList,
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
  methods: {
    checkAllowFeedback(formData, action) {
      if (
        formData.fdStatus === 'draft' ||
        dayjs().valueOf() < formData.fdVisitPlanBeginTime
      ) {
        return false;
      }

      if (action === 'clockin' && dayjs().valueOf() > formData.fdVisitPlanEndTime) {
        return false;
      }

      return true;
    },
    handleFeedback(formData, isEdit) {
      if (isEdit) {
        this.$router.push({
          path: `/Salesman/Visit/VisitFeedbackEdit/${formData.visitId}`,
        });
      } else {
        this.$router.push({
          path: '/Salesman/Visit/VisitFeedbackCreate',
          query: {
            visitId: formData.id,
          },
        });
      }
    },
    checkAllowEdit(formData) {
      if (
        formData.fdClockCount > 0 ||
        formData.fdFeedbackCount > 0 ||
        dayjs().valueOf() > formData.fdVisitPlanEndTime
      ) {
        return false;
      }

      return true;
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '有效';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
