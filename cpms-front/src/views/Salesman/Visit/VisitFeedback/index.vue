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
              <p-breadcrumb-item>拜访管理</p-breadcrumb-item>
              <p-breadcrumb-item>
                拜访反馈{{ isEdit ? '编辑' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleSubmit" :loading="loading">
              {{ isEdit ? '保存' : '提交' }}
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item :label="`${moduleName}名称`" prop="fdModuleType">
                <p-input read-only v-model="formData.fdModuleType" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="实际拜访人姓名" prop="fdVisitName">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdVisitName"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="实际拜访人电话" prop="fdVisitMobile">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdVisitMobile"
                  placeholder="请输入"
                  oninput="value=value.replace(/[^\d]/g,'')"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="实际拜访人职务" prop="fdVisitJob">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdVisitJob"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row>
            <p-col :span="24">
              <p-form-model-item label="反馈内容" prop="fdProjectFeedback">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdProjectFeedback"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row>
            <p-col :span="24">
              <p-form-model-item label="上传图片" prop="sysAttContractAspectParams">
                <uploader
                  mode="picture"
                  multiple
                  v-model="formData.sysAttContractAspectParams"
                  accept="image/*"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <project-list
          v-if="formData.fdVisitFeedbackType === 'cust'"
          v-model="formData"
          style="margin-top: 16px"
        />

        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import ProjectList from './project-list';
import formMixin from './form';

export default {
  name: '拜访反馈编辑',
  mixins: [formMixin],
  components: {
    ProjectList,
  },
  data() {
    const { id } = this.$route.params;
    return { id };
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
    handleSubmit() {
      if (this.loading) {
        return;
      }

      this.$refs.form.validate((vaild) => {
        if (!vaild) {
          this.message.error('表单字段校验未通过');
          return;
        }

        if (!this.checkFormData(this.formData)) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单',
          onOk: () => {
            this.submitFormData(this.formData, this.isEdit);
          },
          onCancel: () => {},
        });
      });
    },
    handleSelectAddress(value) {
      this.form.address = value[0].text;
    },
  },
};
</script>

<style lang="scss" scoped></style>
