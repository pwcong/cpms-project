<template>
  <list-layout>
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="外勤打卡详情" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>
    <template v-slot:main="{ className }">
      <div style="top: 46px; height: calc(100% - 46px)" :class="className">
        <van-form>
          <block theme="primary" title="基本信息">
            <van-field readonly :value="formData.fdUserName" label="姓名" />
            <van-field readonly :value="formData.fdDeptName" label="部门" />
            <van-field readonly :value="formData.fdUserCode" label="工号" />
            <van-field readonly :value="formatDateTime(formData.fdClockTime)" label="日期" />
          </block>

          <block theme="primary" title="外勤信息">
            <van-field readonly :value="formData.fdClockAddress" label="打卡地点" />
            <van-field readonly :value="formData.fdRelateModule" label="关联拜访计划" />
            <van-field readonly :value="formatDateTime(formData.fdClockTime)" label="打卡日期" />
            <van-field readonly :value="formData.fdCause" label="外勤打卡理由" type="textarea" />
            <van-field readonly label="图片">
              <template #input>
                <picture-uploader mode="picture" readonly :value="formData.sysAttContractAspectParams" />
              </template>
            </van-field>
          </block>
          <van-tabs>
            <van-tab title="审批记录">
              <audit-record moduleFlag="cpms_sperson_clock_record_out" :moduleId="id" readonly></audit-record>
            </van-tab>
            <van-tab title="审批信息">
              <audit-info readonly :moduleId="id" moduleFlag="cpms_sperson_clock_record_out"></audit-info>
            </van-tab>
          </van-tabs>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import formMixin from './form';
import { formatMixin } from '@/mixins';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
export default {
  mixins: [formMixin, formatMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  methods: {},
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
  components: {
    AuditRecord,
    AuditInfo,
  },
};
</script>

<style lang="scss" scoped></style>
