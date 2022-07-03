<template>
  <list-layout class="page-weekly-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="周报详情"
        left-text="返回"
        left-arrow
        :right-text="allowEdit ? '编辑' : undefined"
        @click-right="handleEdit(formData.id)"
        @click-left="handleCancel(false)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form">
          <block>
            <van-field label="所在周" readonly>
              <template #input>
                <div>
                  <div>
                    {{ `${formData.fdYear || '-'} 年第 ${formData.fdWeek || '-'} 周` }}
                  </div>
                  <div style="font-size: 12px; color: #999999">
                    {{ `${(formData.fdBeginTime || '').slice(0, 10)} ~ ${(formData.fdEndTime || '').slice(0, 10)}` }}
                  </div>
                </div>
              </template>
            </van-field>
          </block>

          <block title="本周统计" theme="primary">
            <week-info :value="formData" />
            <system-data :value="formData" />
          </block>

          <block theme="primary" title="本周总结">
            <van-field
              label="本周重点工作完成情况"
              v-model="formData.fdMonthPerformance"
              rows="3"
              readonly
              type="textarea"
            />
            <van-field
              label="本周目标达成情况"
              v-model="formData.fdWeeklySituation"
              rows="3"
              readonly
              type="textarea"
            />
            <van-field label="重大项目进展" v-model="formData.fdProjectProgress" rows="3" readonly type="textarea" />
            <van-field label="所需支持" v-model="formData.fdNeedHelp" rows="3" readonly type="textarea" />
          </block>

          <sales-list readonly :value="formData" />

          <self-list readonly :value="formData" />

          <visit-list readonly :value="formData" />
          <block>
            <van-field label="下周重点工作事项" v-model="formData.fdNextweekEvents" rows="3" readonly type="textarea" />
          </block>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import formMixin from '../WeeklyEdit/form';
import { userMixin } from '@/mixins';
import VisitList from '../WeeklyEdit/visit-list';
import SalesList from '../WeeklyEdit/sales-list';
import SelfList from '../WeeklyEdit/self-list';
import SystemData from '../WeeklyEdit/system-data';
import WeekInfo from '../WeeklyEdit/week-info';

export default {
  mixins: [userMixin, formMixin],
  components: {
    VisitList,
    SalesList,
    SelfList,
    SystemData,
    WeekInfo,
  },
  data() {
    const { id } = this.$route.params;

    return {
      id,
    };
  },
  computed: {
    allowEdit() {
      return this.formData.fdStatus == 'draft' || this.formData.fdStatus == 'reject';
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

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.page-weekly-detail {
}
</style>
