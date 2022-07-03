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
      <p-form-model-item label="项目阶段" prop="fdProjectStageId">
        <select-project-stage
          placeholder="请选择"
          :value="
            !!tempValue.fdProjectStageId ? [{ value: tempValue.fdProjectStageId }] : []
          "
          @change="handleChangeStage"
        />
      </p-form-model-item>
      <p-form-model-item label="完成比例" prop="fdPercent">
        <p-input-number
          style="width: 100%"
          placeholder="请输入"
          v-model="tempValue.fdPercent"
          :min="0"
          :max="100"
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
import SelectProjectStage from '../components/select/project-stage';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectStageId: '',
    fdName: '',
    fdPercent: '',
  },
});

export default {
  name: 'setting-stage',
  mixins: [selectionMixin],
  components: {
    SelectProjectStage,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}阶段信息`;
    },
  },
  data() {
    return {
      rules: {
        fdProjectStageId: [
          {
            required: true,
            message: '请选择项目阶段',
            trigger: 'change',
          },
        ],
        fdPercent: [
          {
            required: true,
            message: '请输入完成比例',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.onOk();
      });
    },
    handleChangeStage(value) {
      value = value[0];
      this.tempValue.fdProjectStageId = value.value;
      this.tempValue.fdName = value.text;
      this.tempValue.fdPercent = value.data.fdCompletePercentage;
    },
  },
};
</script>
