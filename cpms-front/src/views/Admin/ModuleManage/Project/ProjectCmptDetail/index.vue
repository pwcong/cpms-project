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
              <p-breadcrumb-item>后台管理</p-breadcrumb-item>
              <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
              <p-breadcrumb-item>项目模块</p-breadcrumb-item>
              <p-breadcrumb-item>项目组件详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleEdit(id)"> 编辑 </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block title="组件信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="组件名称" prop="fdName">
                <p-input v-model="formData.fdName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="组件ID" prop="fdComponentId">
                <p-input v-model="formData.fdComponentId" read-only />
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
                  read-only
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
                    read-only
                    v-model="formData.fdFieldLength"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="输入提示" prop="fdPrompt">
                  <p-input v-model="formData.fdPrompt" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="其他提示" prop="fdOtherPrompt">
                  <p-input v-model="formData.fdOtherPrompt" read-only />
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
                  <p-input v-model="formData.fdAttKey" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="其他提示" prop="fdOtherPrompt">
                  <p-input v-model="formData.fdOtherPrompt" read-only />
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
                    read-only
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
                  <p-input v-model="formData.fdDropDown" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="是否多选" prop="fdIsMultipleChoice">
                  <p-input
                    :value="formData.fdIsMultipleChoice === '1' ? '是' : '否'"
                    read-only
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
                  <p-input v-model="formData.fdDisplay" read-only />
                </p-form-model-item>
              </p-col>
            </p-row>
          </block>
        </template>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from '../ProjectCmptEdit/form';

import SelectComponentType from '../components/select/component-type';
import SelectProcessType from '../components/select/process-type';

export default {
  name: '项目组件详情',
  mixins: [formMixin],
  components: {
    SelectComponentType,
    SelectProcessType,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
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
};
</script>
