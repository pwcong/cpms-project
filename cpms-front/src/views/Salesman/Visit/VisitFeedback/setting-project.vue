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
      <p-form-model-item label="项目名称" prop="fdProjectId">
        <select-project
          :customerId="customerId"
          status="todo,audit,follow,done"
          :value="
            !!tempValue.fdProjectId
              ? [
                  {
                    value: tempValue.fdProjectId,
                    text: tempValue.fdProjectName,
                  },
                ]
              : []
          "
          placeholder="请选择"
          allow-clear
          @change="
            ((tempValue.fdProjectId = ($event[0] || {}).value) || true) &&
              (tempValue.fdProjectName = ($event[0] || {}).text)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="反馈内容" prop="fdProjectFeedback">
        <p-textarea
          placeholder="请输入"
          :autoSize="{
            minRows: 4,
          }"
          :maxLength="500"
          v-model="tempValue.fdProjectFeedback"
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
import SelectProject from '@/views/components/select/project';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectId: '',
    fdProjectName: '',
  },
});

export default {
  name: 'setting-project',
  mixins: [selectionMixin],
  props: {
    customerId: {
      type: String,
    },
  },
  components: {
    SelectProject,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}项目状态`;
    },
  },
  data() {
    return {
      rules: {
        fdProjectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        fdProjectFeedback: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' },
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
  },
};
</script>
