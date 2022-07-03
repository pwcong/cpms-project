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
                项目组件{{ isEdit ? '编辑' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleSubmit()" :loading="loading">
              {{ isEdit ? '保存' : '提交' }}
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="组件信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="组件名称" prop="fdName">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdName"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="组件ID" prop="fdComponentId">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdComponentId"
                  :placeholder="isEdit ? undefined : '请输入'"
                  :readOnly="isEdit"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="组件类型" prop="fdType">
                <select-component-type
                  :value="
                    !!formData.fdType
                      ? [{ text: formData.fdTypeName, value: formData.fdType }]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="
                    ((formData.fdType = ($event[0] || {}).value) || true) &&
                      (formData.fdTypeName = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <template v-if="['singleText', 'multipleText'].indexOf(selectedType) > -1">
          <block
            theme="primary"
            :title="selectedType === 'singleText' ? '单行文本组件' : '多行文本组件'"
            style="margin-top: 16px"
          >
            <p-row style="margin-top: 16px">
              <p-col :span="8">
                <p-form-model-item label="字段长度" prop="fdFieldLength">
                  <p-input-number
                    style="width: 100%"
                    placeholder="请输入"
                    v-model="formData.fdFieldLength"
                    :min="0"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="输入提示" prop="fdPrompt">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdPrompt"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="其他提示" prop="fdOtherPrompt">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdOtherPrompt"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>
        <template v-if="selectedType === 'att'">
          <block title="附件组件" style="margin-top: 16px" theme="primary">
            <p-row style="margin-top: 16px">
              <p-col :span="8">
                <p-form-model-item label="附件Key值" prop="fdAttKey">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdAttKey"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="其他提示" prop="fdOtherPrompt">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdOtherPrompt"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>
        <template v-if="selectedType === 'process'">
          <block title="流程组件" style="margin-top: 16px" theme="primary">
            <p-row style="margin-top: 16px">
              <p-col :span="8">
                <p-form-model-item label="关联流程" prop="fdProcessId">
                  <select-process-type
                    :value="
                      !!formData.fdProcessId
                        ? [
                            {
                              text: formData.fdProcessName,
                              value: formData.fdProcessId,
                            },
                          ]
                        : []
                    "
                    placeholder="请选择"
                    allow-clear
                    @change="
                      ((formData.fdProcessId = ($event[0] || {}).value) || true) &&
                        (formData.fdProcessName = ($event[0] || {}).text)
                    "
                  />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>
        <template v-if="selectedType === 'dropDown'">
          <block title="下拉选择组件" style="margin-top: 16px" theme="primary">
            <p-row style="margin-top: 16px">
              <p-col :span="8">
                <p-form-model-item label="关联主数据字典关键字" prop="fdDropDown">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdDropDown"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="是否多选" prop="fdIsMultipleChoice">
                  <select-yes-or-no
                    :value="
                      !!formData.fdIsMultipleChoice
                        ? [{ value: formData.fdIsMultipleChoice }]
                        : []
                    "
                    placeholder="请选择"
                    @change="formData.fdIsMultipleChoice = $event[0].value"
                  />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>
        <template v-if="selectedType === 'textDisplay'">
          <block title="文字显示组件" style="margin-top: 16px" theme="primary">
            <p-row style="margin-top: 16px">
              <p-col :span="8">
                <p-form-model-item label="要显示的文字" prop="fdDisplay">
                  <p-input
                    :maxLength="200"
                    v-model="formData.fdDisplay"
                    placeholder="请输入"
                  />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>

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

import SelectComponentType from '../components/select/component-type';
import SelectProcessType from '../components/select/process-type';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

export default {
  name: '项目组件编辑',
  mixins: [formMixin],
  components: {
    SelectComponentType,
    SelectProcessType,
    SelectYesOrNo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
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
            this.submitFormData(
              {
                ...this.formData,
              },
              this.isEdit
            );
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
