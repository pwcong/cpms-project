<template>
  <list-layout class="page-visit-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="拜访计划详情"
        left-text="返回"
        :right-text="allowEdit ? '编辑' : undefined"
        left-arrow
        @click-left="handleCancel(false)"
        @click-right="handleEdit(formData.id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form">
          <block theme="primary" title="拜访内容">
            <van-field
              :value="`${formData.fdVisitPlanYear}年第${formData.fdVisitPlanWeek}周`"
              name="fdVisitPlanWeek"
              label="计划拜访日期"
              readonly
            />
            <van-field v-model="formData.fdVisitType" name="fdVisitType" label="拜访类型" readonly>
              <template #input>
                <dict-text
                  dictCode="cpms_visit_type"
                  systemCode="cpms"
                  :value="(formData.fdVisitType || '').split(',')"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdModuleType" name="fdModuleType" :label="`${moduleName}名称`" readonly />
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field v-model="formData.fdVisitWay" name="fdVisitWay" label="拜访方式" readonly>
              <template #input>
                <dict-text
                  dictCode="cpms_visit_way"
                  systemCode="cpms"
                  :value="(formData.fdVisitWay || '').split(',')"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdVisitAddress" name="fdVisitAddress" label="拜访地址" readonly />
            <van-field v-model="formData.fdVisitName" name="fdVisitName" label="拜访人姓名" readonly />
            <van-field v-model="formData.fdVisitMobile" name="fdVisitMobile" label="拜访人电话" readonly />
            <van-field v-model="formData.fdVisitJob" name="fdVisitJob" label="拜访人职务" readonly />
            <van-field
              v-model="formData.fdVisitPurpose"
              name="fdVisitPurpose"
              label="拜访目的"
              readonly
              type="textarea"
            />
          </block>
          <clock-list readonly v-model="formData" />
          <feedback-list readonly v-model="formData" />
          <project-list v-if="formData.fdVisitType === 'cust'" readonly v-model="formData" />
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { userMixin } from '@/mixins';
import formMixin from '../VisitEdit/form';
import dayjs from 'dayjs';
import ClockList from './clock-list';
import FeedbackList from './feedback-list';
import ProjectList from './project-list';

export default {
  mixins: [userMixin, formMixin],
  components: {
    ClockList,
    ProjectList,
    FeedbackList,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  computed: {
    allowEdit() {
      if (
        this.formData.fdClockCount > 0 ||
        this.formData.fdFeedbackCount > 0 ||
        dayjs().valueOf() > this.formData.fdVisitPlanEndTime
      ) {
        return false;
      }

      return true;
    },
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
  methods: {},
};
</script>

<style lang="scss" scoped></style>
