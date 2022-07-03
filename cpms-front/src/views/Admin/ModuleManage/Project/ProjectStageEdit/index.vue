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
              <p-breadcrumb-item>后台管理</p-breadcrumb-item>
              <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
              <p-breadcrumb-item>项目模块</p-breadcrumb-item>
              <p-breadcrumb-item>
                项目阶段{{ isEdit ? '编辑' : '新建' }}
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
        <block title="项目阶段信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="项目阶段名称" prop="fdName">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdName"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <!-- <p-col :span="8">
                <p-form-model-item label="是否有效" prop="fdIsValid">
                <select-yes-or-no
            placeholder="请选择"
            :value="!!formData.fdIsValid ? [{ value: formData.fdIsValid }] : []"
            @change="formData.fdIsValid = $event[0].value"
            />
                </p-form-model-item>
            </p-col> -->
            <p-col :span="8">
              <p-form-model-item label="默认完成比例" prop="fdCompletePercentage">
                <p-input-number
                  style="width: 100%"
                  placeholder="请输入"
                  v-model="formData.fdCompletePercentage"
                  :min="0"
                  :max="100"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <cmpt-list
          :readOnly="!!isEdit"
          :moduleId="id"
          style="margin-top: 16px"
          v-model="formData"
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
import formMixin from './form';
import CmptList from './cmpt-list';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

export default {
  name: '项目阶段编辑',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  components: {
    CmptList,
    SelectYesOrNo,
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

      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        if (!this.checkFormData(this.formData)) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单?',
          onOk: () => {
            this.submitFormData(this.formData, this.isEdit);
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
