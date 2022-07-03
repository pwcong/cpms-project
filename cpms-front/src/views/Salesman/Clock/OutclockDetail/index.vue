<template>
  <list-layput style="padding-bottom: 16px">
    <p-form-model :model="formData" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
            <p-breadcrumb-item>考勤管理</p-breadcrumb-item>
            <p-breadcrumb-item>外勤申请详情</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCancel"> 返回 </p-button>
        </template>
      </block>
      <block title="基本情况" style="margin-top: 16px" theme="primary">
        <p-row style="margin-top: 16px">
          <p-col :span="8">
            <p-form-model-item label="申请人" prop="fdUserName">
              <p-input v-model="formData.fdUserName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="申请人部门" prop="fdDeptName">
              <p-input v-model="formData.fdDeptName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="申请人工号" prop="fdUserCode">
              <p-input v-model="formData.fdUserCode" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="申请时间" prop="fdClockTime">
              <p-input :value="formatDateTime(formData.fdClockTime)" read-only />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block title="外勤详情" style="margin-top: 16px" theme="primary">
        <p-row style="margin-top: 16px">
          <p-col :span="8">
            <p-form-model-item label="打卡地点">
              <p-input v-model="formData.fdClockAddress" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="关联拜访计划">
              <p-input v-model="formData.fdRelateModule" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="打卡时间">
              <p-input :value="formatDateTime(formData.fdClockTime)" read-only />
            </p-form-model-item>
          </p-col>
        </p-row>
        <p-row>
          <p-col :span="24">
            <p-form-model-item label="外勤打卡理由">
              <p-textarea
                :autoSize="{
                  minRows: 4,
                }"
                v-model="formData.fdCause"
                read-only
              />
            </p-form-model-item>
          </p-col>
        </p-row>
        <p-row>
          <p-col :span="24">
            <p-form-model-item label="图片">
              <uploader
                mode="picture"
                read-only
                :value="formData.sysAttContractAspectParams"
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
          <audit-info
            readOnly
            :moduleId="id"
            moduleFlag="cpms_sperson_clock_record_out"
          />
        </p-tab-pane>
        <p-tab-pane key="2" tab="审批记录">
          <audit-record
            readOnly
            :moduleId="id"
            moduleFlag="cpms_sperson_clock_record_out"
          />
        </p-tab-pane>
      </p-tabs>

      <!-- <outclock-list v-model="formData" /> -->
    </p-form-model>
  </list-layput>
</template>

<script>
import formMixin from './form';
import OutclockList from './outclock-list';
import { formatMixin } from '@/mixins';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';

export default {
  name: '外勤申请详情',
  mixins: [formMixin, formatMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
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
    OutclockList,
    AuditRecord,
    AuditInfo,
  },
};
</script>

<style lang="scss" scoped></style>
