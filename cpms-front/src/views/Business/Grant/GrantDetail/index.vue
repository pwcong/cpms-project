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
              <p-breadcrumb-item>商机管理</p-breadcrumb-item>
              <p-breadcrumb-item>授权管理</p-breadcrumb-item>
              <p-breadcrumb-item>授权详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleEdit(id)"
              v-if="checkButton(formData, 'edit')"
            >
              编辑
            </p-button>
            <oawithdraw-wrapper
              v-if="checkButton(formData, 'withdrawGrant')"
              :fdModuleId="id"
              fdModuleFlag="cpms_project_grant_main"
              style="margin-left: 10px"
              @change="initFormData(id)"
            >
              <p-button type="primary">撤回</p-button>
            </oawithdraw-wrapper>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleDel(formData)"
              v-if="checkButton(formData, 'edit')"
            >
              删除
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>

        <block title="填单人信息" style="margin-top: 16px" theme="primary">
          <template #action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="填单人姓名" prop="fdLoginName">
                <p-input v-model="formData.fdUserName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8"
              ><p-form-model-item label="填单人部门" prop="fdDeptName">
                <p-input v-model="formData.fdDeptName" readOnly />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="填单人电话" prop="fdUserPhone">
                <p-input readOnly v-model="formData.fdUserPhone" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="填单时间" prop="createTime">
                <p-input :value="formatDate(formData.createTime)" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block title="授权信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="盖章法人" prop="fdCorporateCode">
                <select-corporate
                  readOnly
                  :value="
                    !!formData.fdCorporateCode
                      ? [
                          {
                            value: formData.fdCorporateCode,
                            text: formData.fdCorporateName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="盖章类型" prop="fdSealType">
                <select-seal-type
                  readOnly
                  :value="
                    !!formData.fdSealType
                      ? [
                          {
                            value: formData.fdSealType,
                            text: formData.fdSealType,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目名称" prop="fdProjectMainId">
                <select-project
                  status="follow"
                  readOnly
                  :value="
                    !!formData.fdProjectMainId
                      ? [
                          {
                            value: formData.fdProjectMainId,
                            text: formData.fdProjectName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="被授权代理商名称" prop="fdCustName">
                <p-input readOnly v-model="formData.fdCustName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="授权时间起" prop="fdBeginTime">
                <!-- <p-date-picker
                  v-model="formData.fdBeginTime"
                  show-time
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  readOnly
                /> -->
                <p-input readOnly :value="formatDate(formData.fdBeginTime)" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="授权时间止" prop="fdEndTime">
                <!-- <p-date-picker
                  v-model="formData.fdEndTime"
                  show-time
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  readOnly
                /> -->
                <p-input readOnly :value="formatDate(formData.fdEndTime)" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="品类" prop="fdProductLineList">
                <p-input
                  :value="
                    formData.fdProductLineList.map((d) => d.fdProductLineName).join(',')
                  "
                  readOnly
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="授权附件">
                <uploader readOnly :value="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="授权理由概述" prop="fdReasonSummary">
                <p-textarea
                  readOnly
                  v-model="formData.fdReasonSummary"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block title="审批人信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="直管/分部领导" prop="fdLeaderList">
                <p-input
                  readOnly
                  :value="formData.fdLeaderList.map((d) => d.fdPersonName).join(',')"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="加签人员" prop="fdAuditorList">
                <p-input
                  readOnly
                  :value="formData.fdAuditorList.map((d) => d.fdPersonName).join(',')"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="一级部门负责人/商总" prop="fdManagerList">
                <p-input
                  readOnly
                  :value="formData.fdManagerList.map((d) => d.fdPersonName).join(',')"
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
          <p-tab-pane key="1" tab="更多信息">
            <more-info :value="formData" />
          </p-tab-pane>
          <p-tab-pane key="2" tab="审批信息">
            <audit-info readOnly :moduleId="id" moduleFlag="cpms_project_grant_main" />
          </p-tab-pane>
          <p-tab-pane key="3" tab="审批记录">
            <audit-record readOnly :moduleId="id" moduleFlag="cpms_project_grant_main" />
          </p-tab-pane>
        </p-tabs>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import formMixin from '../GrantEdit/form';
import { formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import SelectProject from '@/views/components/select/project';
import SelectCorporate from '@/views/components/select/corporate';
import SelectSealType from '../components/select/seal-type';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import MoreInfo from '@/views/components/more-info';

export default {
  name: '授权详情',
  mixins: [formMixin, formatMixin, commonMixin],
  components: {
    SelectCorporate,
    SelectSealType,
    SelectProject,
    AuditRecord,
    AuditInfo,
    MoreInfo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  methods: {
    handleDel(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.grant.delGrantMain({
            id: record.id,
            version: record.version,
            fdIsValid: 0,
          });
          this.$message.success('删除成功');
          // this.onRefresh();
          this.handleCancel();
        },
        onCancel: () => {},
      });
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
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'success':
          return '通过';
        case 'done':
          return '完成';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '暂存';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
