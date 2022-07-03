<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
              <p-breadcrumb-item>周报管理</p-breadcrumb-item>
              <p-breadcrumb-item>周报{{ isEdit ? '编辑' : '新建' }}</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <!-- <p-button
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdStatus === 'draft'"
            >
              暂存
            </p-button> -->
            <oasubmit-wrapper
              moduleFlag="cpms_sperson_weekly"
              :moduleId="id"
              style="margin-left: 8px"
              :beforeSubmit="handleBeforeSubmit"
              :status="formData.fdStatus"
              @submit="handleSubmit(false, $event)"
            >
              <p-button type="primary" :loading="loading">
                {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
              </p-button>
            </oasubmit-wrapper>

            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block style="margin-top: 16px" theme="primary">
          <p-row :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="所在周" prop="fdWeek">
                <!-- <p-input
                read-only
                :value="
                  `${formData.fdYear || '-'} 年第 ${formData.fdWeek || '-'} 周`
                "
              /> -->
                <div style="display: flex">
                  <select-year
                    style="flex: 1"
                    :value="!!formData.fdYear ? [{ value: formData.fdYear }] : []"
                    placeholder="请选择年"
                    @change="handleChangeYear"
                  />
                  <select-week
                    style="flex: 1; margin-left: 8px"
                    :year="formData.fdYear"
                    :value="!!formData.fdWeek ? [{ value: formData.fdWeek }] : []"
                    placeholder="请选择周"
                    @change="handleChangeWeek"
                  />
                </div>
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block title="本周统计" style="margin-top: 16px" theme="primary">
          <week-info :value="formData" style="margin-top: 16px" />
          <system-data :value="formData" style="margin-top: 16px" />
        </block>

        <block title="本周总结" style="margin-top: 32px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="12">
              <p-form-model-item
                label="本周重点工作完成情况"
                prop="fdMonthPerformance"
                placeholder="请输入"
              >
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdMonthPerformance"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="本周目标达成情况" prop="fdWeeklySituation">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdWeeklySituation"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="重大项目进展" prop="fdProjectProgress">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdProjectProgress"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item label="所需支持" prop="fdNeedHelp">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdNeedHelp"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <sales-list style="margin-top: 32px" v-model="formData" />

        <self-list style="margin-top: 32px" v-model="formData" />

        <visit-list style="margin-top: 32px" v-model="formData" />

        <block style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item prop="fdNextweekEvents" label="下周重点工作事项">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdNextweekEvents"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block style="text-align: center; margin-top: 32px">
          <oasubmit-wrapper
            moduleFlag="cpms_sperson_weekly"
            :moduleId="id"
            style="width: 150px"
            :beforeSubmit="handleBeforeSubmit"
            :status="formData.fdStatus"
            @submit="handleSubmit(false, $event)"
          >
            <p-button type="primary" :loading="loading">
              {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>
          </oasubmit-wrapper>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from './form';
import WeekInfo from './week-info';
import SystemData from './system-data';
import VisitList from './visit-list';
import SalesList from './sales-list';
import SelfList from './self-list';

import SelectYear from '../../components/select/year';
import SelectWeek from '../../components/select/week';

export default {
  name: '周报编辑',
  mixins: [formMixin],
  components: {
    WeekInfo,
    SystemData,
    VisitList,
    SalesList,
    SelfList,
    SelectYear,
    SelectWeek,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {
    handleChangeYear(value) {
      this.formData.fdYear = value[0].value;
      this.formData.fdWeek = '';
    },
    handleChangeWeek(value) {
      this.formData.fdWeek = value[0].value;
      this.initWeekData(this.formData.fdYear, this.formData.fdWeek);
    },
    handleBeforeSubmit() {
      if (this.loading) {
        return false;
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          if (!valid || !this.checkFormData(this.formData)) {
            this.$message.error('表单字段校验未通过');
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    },
    handleSubmit(isDraft, form) {
      if (this.loading) {
        return false;
      }
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$confirm({
        title: '是否确认提交表单?',
        onOk: () => {
          this.submitFormData(this.formData, this.isEdit ? 'edit' : 'add');
        },
        onCancel: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
