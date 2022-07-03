<template>
  <list-layout class="page-weekly-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`周报${isEdit ? '编辑' : '新建'}`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit">
          <block>
            <!-- <van-field
              label="所在周"
              :value="`${formData.fdYear || '-'}  ${formData.fdWeek || '-'} 周`"
            /> -->
            <van-field
              readonly
              required
              clickable
              is-link
              name="fdYear"
              :value="formData.fdYear"
              label="年"
              placeholder="请选择"
              @click="showYear = true"
              :rules="[{ required: true, message: '请选择年' }]"
            />
            <van-field
              readonly
              required
              clickable
              is-link
              name="fdWeek"
              :value="formData.fdWeek"
              label="周"
              placeholder="请选择"
              @click="showWeek = true"
              :rules="[{ required: true, message: '请选择周' }]"
            />
          </block>

          <block title="本周统计" theme="primary">
            <week-info :value="formData" />
            <system-data :value="formData" />
          </block>

          <block theme="primary" title="本周总结">
            <van-field
              label="本周重点工作完成情况"
              placeholder="请输入"
              v-model="formData.fdMonthPerformance"
              name="fdMonthPerformance"
              rows="3"
              type="textarea"
              required
              :rules="[{ required: true, message: '请输入本周重点工作完成情况' }]"
            />
            <van-field
              label="本周目标达成情况"
              placeholder="请输入"
              v-model="formData.fdWeeklySituation"
              rows="3"
              type="textarea"
              required
              name="fdWeeklySituation"
              :rules="[{ required: true, message: '请输入本周目标达成情况' }]"
            />
            <van-field
              label="重大项目进展"
              placeholder="请输入"
              v-model="formData.fdProjectProgress"
              rows="3"
              type="textarea"
              required
              name="fdProjectProgress"
              :rules="[{ required: true, message: '请输入重大项目进展' }]"
            />
            <van-field
              label="所需支持"
              placeholder="请输入"
              v-model="formData.fdNeedHelp"
              rows="3"
              type="textarea"
              required
              name="fdNeedHelp"
              :rules="[{ required: true, message: '请输入所需支持' }]"
            />
          </block>

          <sales-list :value="formData" />

          <self-list :value="formData" />

          <visit-list :value="formData" />
          <block>
            <van-field
              label="下周重点工作事项"
              placeholder="请输入"
              v-model="formData.fdNextweekEvents"
              rows="3"
              type="textarea"
              required
              name="fdNextweekEvents"
              :rules="[{ required: true, message: '请输入下周重点工作事项' }]"
            />
          </block>
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :moduleId="id"
          moduleFlag="cpms_sperson_weekly"
          :beforeSubmit="handleBeforeSubmit"
          :status="formData.fdStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger"> 提交 </van-button>
        </oasubmit-wrapper>
      </div>
    </template>

    <van-popup v-model="showYear" position="bottom">
      <picker-year show-toolbar title="选择年" @confirm="handleSelectYear" @cancel="showYear = false" />
    </van-popup>
    <van-popup v-model="showWeek" position="bottom">
      <picker-week
        :year="formData.fdYear"
        show-toolbar
        title="选择周"
        @confirm="handleSelectWeek"
        @cancel="showWeek = false"
      />
    </van-popup>
  </list-layout>
</template>

<script>
import formMixin from '../WeeklyEdit/form';
import { userMixin } from '@/mixins';

import VisitList from './visit-list';
import SalesList from './sales-list';
import SelfList from './self-list';
import PickerYear from '@/views/components/picker/year';
import PickerWeek from '@/views/components/picker/week';
import SystemData from './system-data';
import WeekInfo from './week-info';

export default {
  mixins: [userMixin, formMixin],
  components: {
    VisitList,
    PickerYear,
    PickerWeek,
    SalesList,
    SelfList,
    SystemData,
    WeekInfo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showYear: false,
      showWeek: false,
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
    handleSelectYear(res) {
      this.formData.fdYear = res.value;
      this.formData.fdWeek = '';
      this.showYear = false;
    },
    handleSelectWeek(res) {
      this.formData.fdWeek = res.value;
      this.showWeek = false;
      this.initWeekData(this.formData.fdYear, this.formData.fdWeek);
    },
    handleBeforeSubmit() {
      if (this.loading) {
        return false;
      }
      return new Promise((resolve) => {
        this.$refs.form
          .validate()
          .then(() => {
            if (!this.checkFormData(this.formData)) {
              resolve(false);
              return;
            }
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    },
    handleSubmit(form) {
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$refs.form.submit();
    },
    onSubmit() {
      if (this.loading) {
        return;
      }
      this.$dialog
        .confirm({
          title: '是否确认提交表单?',
        })
        .then(() => {
          this.submitFormData(this.formData, this.isEdit ? 'edit' : 'add');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.page-weekly-edit {
}
</style>
