<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-form-model-item label="项目组件" prop="fdComponentConfigId">
        <select-project-cmpt
          placeholder="请选择"
          :value="
            !!tempValue.fdComponentConfigId
              ? [{ value: tempValue.fdComponentConfigId }]
              : []
          "
          @change="handleChangeComponent"
        />
      </p-form-model-item>
      <p-form-model-item label="组件名称" prop="fdComponentName">
        <p-input
          :maxLength="200"
          v-model="tempValue.fdComponentName"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="组件ID" prop="fdComponentId">
        <p-input :maxLength="200" v-model="tempValue.fdComponentId" read-only />
      </p-form-model-item>
      <p-form-model-item label="组件类型" prop="fdComponentTypeName">
        <p-input :maxLength="200" v-model="tempValue.fdComponentTypeName" read-only />
      </p-form-model-item>
      <p-form-model-item label="组件输入提示" prop="fdComponentInputPrompt">
        <p-input
          :maxLength="200"
          v-model="tempValue.fdComponentInputPrompt"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="组件其他提示" prop="fdComponentOtherPrompt">
        <p-input
          :maxLength="200"
          v-model="tempValue.fdComponentOtherPrompt"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="是否必填" prop="fdIsRequired">
        <select-yes-or-no
          placeholder="请选择"
          :value="!!tempValue.fdIsRequired ? [{ value: tempValue.fdIsRequired }] : []"
          @change="tempValue.fdIsRequired = $event[0].value"
        />
      </p-form-model-item>

      <p-form-model-item label="是否有效" prop="fdIsValid">
        <select-yes-or-no
          placeholder="请选择"
          :value="!!tempValue.fdIsValid ? [{ value: tempValue.fdIsValid }] : []"
          @change="tempValue.fdIsValid = $event[0].value"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectProjectCmpt from '../components/select/project-cmpt';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    componentName: '',
    fdComponentConfigId: '',
    fdComponentName: '',
  },
});

export default {
  name: 'setting-cmpt',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SelectProjectCmpt,
    SelectYesOrNo,
  },
  data() {
    return {
      rules: {
        fdComponentConfigId: [
          {
            required: true,
            message: '请选择项目组件',
            trigger: 'change',
          },
        ],
        fdComponentName: [
          {
            required: true,
            message: '请输入组件名称',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${this.isEdit ? '编辑' : '新增'}组件信息`;
    },
  },
  methods: {
    handleChangeComponent(res) {
      res = res[0];
      if (!res) {
        return;
      }

      const { data = {} } = res;

      this.tempValue.fdComponentConfigId = res.value;
      this.tempValue.componentName = res.text;
      this.tempValue.fdComponentId = data.fdComponentId;
      this.tempValue.fdComponentName = res.text;
      this.tempValue.fdComponentType = data.fdType;
      this.tempValue.fdComponentTypeName = data.fdTypeName;
      this.tempValue.fdComponentInputPrompt = data.fdPrompt;
      this.tempValue.fdComponentOtherPrompt = data.fdOtherPrompt;
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        // 若主表ID存在数据变更需请求接口
        if (!!this.moduleId) {
          try {
            if (this.isEdit) {
              await api.business.putProjectStageComponentForm(this.tempValue);
            } else {
              const data = await api.business.postProjectStageComponentForm({
                ...this.tempValue,
                fdStageConfigId: this.moduleId,
              });

              this.tempValue = {
                ...this.tempValue,
                fdComponentConfigId: data.id,
              };
            }

            this.onOk();
          } catch (e) {
            console.error(e);
          }
        } else {
          this.onOk();
        }
      });
    },
  },
};
</script>
