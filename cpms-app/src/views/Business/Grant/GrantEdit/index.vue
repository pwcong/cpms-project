<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}授权申请`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <van-field
              is-link
              required
              readonly
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入盖章法人' }]"
              :value="formData.fdCorporateName"
              label="盖章法人"
              @click="showstampCorporate = true"
            />
            <van-field
              is-link
              required
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入盖章类型' }]"
              :value="formData.fdSealType"
              label="盖章类型"
              @click="showSealType = true"
            />
            <van-field
              is-link
              required
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入项目名称' }]"
              :value="formData.fdProjectName"
              label="项目名称"
              @click="showProject = true"
            />
            <van-field
              is-link
              required
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入被授权代理商名称' }]"
              :value="formData.fdCustName"
              label="被授权代理商名称"
              @click="showCust = true"
            />
            <van-field
              is-link
              clickable
              readonly
              required
              placeholder="请选择"
              v-model="formData.fdBeginTime"
              :rules="[{ required: true, message: '请输入授权时间起' }]"
              label="授权时间起"
              name="date"
              @click="showBegin = true"
            />
            <van-field
              is-link
              required
              clickable
              placeholder="请选择"
              v-model="formData.fdEndTime"
              :rules="[{ required: true, message: '请输入授权时间止' }]"
              name="data"
              label="授权时间止"
              @click="showEnd = true"
            />
            <van-field
              :value="formData.fdProductLineList.map((d) => d.fdProductLineName).join('.')"
              autosize
              clickable
              is-link
              label="品类"
              placeholder="请选择"
              rows="1"
              type="textarea"
              @click="showProductLine = true"
            >
            </van-field>
            <van-field
              placeholder="请输入"
              required
              :rules="[{ required: true, message: '请输入联系电话' }]"
              v-model="formData.fdUserPhone"
              label="联系电话"
            />
            <van-field
              v-model="formData.fdReasonSummary"
              rows="4"
              type="textarea"
              maxlength="500"
              label="授权理由概述"
              placeholder="请输入内容"
            />
          </block>
          <block theme="primary" title="审批人信息">
            <van-field
              required
              :max="1"
              is-link
              label="直管领导"
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入直管领导' }]"
              :value="formData.fdLeaderList.map((d) => d.fdPersonName).join(';')"
              readonly
              @click="showUser = true"
            />
            <van-field
              label="加签人员"
              is-link
              placeholder="请选择"
              :value="formData.fdAuditorList.map((d) => d.fdPersonName).join(';')"
              clickable
              readonly
              @click="showAuditor = true"
            />
            <van-field
              required
              label="一级部门负责人/商总"
              rows="1"
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入一级部门负责人' }]"
              :value="formData.fdManagerList.map((d) => d.fdPersonName).join(';')"
              clickable
              readonly
              @click="showManager = true"
            />
          </block>
          <block theme="primary" title="其他信息">
            <van-field
              :value="formData.fdCustIndustry"
              clickable
              is-link
              label="所属行业"
              placeholder="请选择"
              readonly
              @click="showIndustry = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdCustIndustry || '').split(',')"
                  dictCode="cpms_business"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdCompanyType" :maxlength="200" label="公司类型" placeholder="请输入" />
            <van-field
              :value="formData.fdProvinceCode"
              clickable
              is-link
              label="所属省份"
              placeholder="请选择"
              readonly
              @click="showProvince = true"
            >
              <template #input>
                <province-text :value="(formData.fdProvinceCode || '').split(',')" />
              </template>
              />
            </van-field>
          </block>
        </van-form>
      </div>
    </template>
    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :moduleId="id"
          moduleFlag="cpms_project_grant_main"
          :beforeSubmit="handleBeforeSubmit"
          :status="formData.fdStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger">
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </van-button>
        </oasubmit-wrapper>
      </div>
    </template>
    <selection-corporate
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
      :visible.sync="showstampCorporate"
      title="请选择盖章法人"
      @change="handleChangeCor"
      searchable
    />
    <selection-seal-type
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
      :visible.sync="showSealType"
      title="请选择"
      @change="handleSealType"
      searchable
    />
    <selection-project
      status="follow"
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
      :visible.sync="showProject"
      title="请选择"
      @change="handleChangeProject"
      searchable
    />
    <selection-customer
      status="pass"
      :value="
        !!formData.fdCustId
          ? [
              {
                value: formData.fdCustId,
                text: formData.fdCustName,
              },
            ]
          : []
      "
      :visible.sync="showCust"
      title="请选择"
      @change="handleChangeCustomer"
      searchable
    />
    <van-popup v-model="showBegin" position="bottom">
      <van-datetime-picker
        type="date"
        @cancel="showBegin = false"
        @confirm="handleBeginConfirm"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup v-model="showEnd" position="bottom">
      <van-datetime-picker
        type="date"
        @cancel="showEnd = false"
        @confirm="handleEndConfirm"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <selection-product-line
      searchable
      :value="
        formData.fdProductLineList.map((d) => ({
          text: d.fdProductLineName,
          value: d.fdProductLineCode,
        }))
      "
      :visible.sync="showProductLine"
      multiple
      title="请选择"
      @change="handleSelectProductLine"
    />
    <selection-dict
      searchable
      :value="!!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []"
      :visible.sync="showIndustry"
      dictCode="cpms_business"
      systemCode="cpms"
      title="请选择"
      @change="formData.fdCustIndustry = $event[0].value"
    />
    <selection-province
      searchable
      :visible.sync="showProvince"
      :value="!!formData.fdProvinceCode ? [{ value: formData.fdProvinceCode }] : []"
      title="选择省"
      @change="handleSelectProvince"
    />
    <selection-user
      searchable
      :visible.sync="showUser"
      :value="
        formData.fdLeaderList.map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="直管领导"
      @change="handleSelectUser"
    />
    <selection-user
      searchable
      multiple
      :visible.sync="showAuditor"
      :value="
        formData.fdAuditorList.map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="加签人员"
      @change="handleAuditorList"
    />
    <selection-user
      searchable
      multiple
      :visible.sync="showManager"
      :value="
        formData.fdManagerList.map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="一级部门负责人/商总"
      @change="handleManager"
    />
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import { userMixin } from '@/mixins';
import formMixin from './form';
import SelectionCorporate from '@/views/components/selection/corporate';
import SelectionSealType from '../components/selection/seal-type';
import SelectionProject from '@/views/components/selection/project';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionProvince from '@/views/components/selection/province';
import { ProvinceText } from '@/views/components/selection/province';

export default {
  mixins: [userMixin, formMixin],
  components: {
    SelectionCorporate,
    SelectionSealType,
    SelectionProject,
    SelectionCustomer,
    SelectionProductLine,
    SelectionProvince,
    ProvinceText,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showstampCorporate: false,
      showSealType: false,
      showProject: false,
      showCust: false,
      showBegin: false,
      showEnd: false,
      showProductLine: false,
      showIndustry: false,
      showProvince: false,
      showUser: false,
      showAuditor: false,
      showManager: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
    };
  },
  created() {
    this.initFormData(this.id);
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  methods: {
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
    onSubmit(action) {
      if (this.loading) {
        return;
      }

      this.$dialog
        .confirm({
          title: `是否确认${action === 'draft' ? '暂存' : '提交'}表单?`,
        })
        .then(() => {
          this.submitFormData(this.formData, action);
        });
    },

    handleChangeCor(res) {
      this.formData.fdCorporateCode = (res[0] || {}).value;
      this.formData.fdCorporateName = (res[0] || {}).text;
    },
    handleSealType(res) {
      this.formData.fdSealType = (res[0] || {}).value;
      this.formData.fdSealType = (res[0] || {}).text;
    },
    handleChangeProject(res) {
      res = res[0];

      if (!res) {
        this.formData.fdProjectMainId = '';
        this.formData.fdProjectName = '';
        this.formData.fdCustId = '';
        this.formData.fdCustName = '';
      } else {
        this.loadProject(res.value);
      }
    },
    handleChangeCustomer(value) {
      this.formData.fdCustName = (value[0] || {}).text;
      this.formData.fdCustId = (value[0] || {}).id;
    },
    handleBeginConfirm(time) {
      this.formData.fdBeginTime = dayjs(time).format('YYYY-MM-DD');
      this.showBegin = false;
    },
    handleEndConfirm(time) {
      this.formData.fdEndTime = dayjs(time).format('YYYY-MM-DD');
      this.showEnd = false;
    },
    handleSelectProductLine(res) {
      this.formData.fdProductLineList = res.map((d) => ({
        fdProductLineName: d.text,
        fdProductLineCode: d.value,
      }));
    },
    handleSelectProvince(res) {
      this.formData.fdProvinceCode = (res[0] || {}).value;
      this.formData.fdProvinceName = (res[0] || {}).text;
      this.formData.fdCityCode = '';
      this.formData.fdCityName = '';
    },
    handleSelectUser(res) {
      this.formData.fdLeaderList = res.map((d) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
      }));
    },
    handleAuditorList(res) {
      this.formData.fdAuditorList = res.map((d) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
      }));
    },
    handleManager(res) {
      this.formData.fdManagerList = res.map((d) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
