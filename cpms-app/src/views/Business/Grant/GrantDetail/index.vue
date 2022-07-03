<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="授权详情"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
        :right-text="checkButton(formData, 'edit') ? '编辑' : undefined"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <block theme="primary" title="填单人信息">
          <van-field label="填单人姓名" v-model="formData.fdUserName" readonly name="fdLoginName" />
          <van-field label="填单人部门" v-model="formData.fdDeptName" readonly name="fdDeptName" />
          <van-field label="填单人电话" v-model="formData.fdUserPhone" readonly name="fdUserPhone" />
          <van-field label="填单时间" name="createTime" v-model="formData.createTime" readonly />
        </block>
        <van-form>
          <block theme="primary" title="基本信息">
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field label="盖章法人" v-model="formData.fdCorporateName" name="fdCorporateCode" readonly />
            <van-field label="盖章类型" v-model="formData.fdSealType" readonly name="fdSealType" />
            <van-field label="项目名称" v-model="formData.fdProjectName" readonly name="fdProjectMainId" />
            <van-field label="被授权代理商名称" v-model="formData.fdCustName" readonly name="fdCustName" />
            <van-field label="授权时间起" v-model="formData.fdBeginTime" readonly name="fdBeginTime" />
            <van-field label="授权时间止" v-model="formData.fdEndTime" readonly name="fdEndTime" />
            <van-field
              label="品类"
              :value="formData.fdProductLineList.map((d) => d.fdProductLineName).join(',')"
              readonly
              name="fdProductLineList"
            />
            <van-field label="联系电话" v-model="formData.fdUserPhone" readonly name="fdUserPhone" />
            <van-field
              rows="4"
              type="textarea"
              maxlength="500"
              label="授权理由概述"
              v-model="formData.fdReasonSummary"
              readonly
              name="fdReasonSummary"
            />
          </block>
          <block theme="primary" title="审批人信息">
            <van-field
              label="直管领导"
              :value="formData.fdLeaderList.map((d) => d.fdPersonName).join(',')"
              readonly
              name="fdLeaderList"
            />
            <van-field
              label="加签人员"
              :value="formData.fdAuditorList.map((d) => d.fdPersonName).join(',')"
              readonly
              name="fdAuditorList"
            />
            <van-field
              label="负责人"
              :value="formData.fdManagerList.map((d) => d.fdPersonName).join(',')"
              readonly
              name="fdManagerList"
            />
          </block>
        </van-form>

        <van-tabs>
          <van-tab title="更多信息">
            <grant-more-info readonly :value="formData" />
          </van-tab>
          <van-tab title="审批信息">
            <audit-info readonly :moduleId="id" moduleFlag="cpms_project_grant_main" />
          </van-tab>
          <van-tab title="审批记录">
            <audit-record readonly :moduleId="id" moduleFlag="cpms_project_grant_main" />
          </van-tab>
        </van-tabs>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { userMixin, formatMixin } from '@/mixins';
import AccreditTable from './accredit-table';
import formMixin from '../GrantEdit/form';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import GrantMoreInfo from '@/views/components/more-info';
import { commonMixin } from '@/views/mixins';

export default {
  name: 'GrantDetail',
  mixins: [userMixin, formMixin, formatMixin, commonMixin],
  components: {
    AccreditTable,
    AuditRecord,
    AuditInfo,

    GrantMoreInfo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
