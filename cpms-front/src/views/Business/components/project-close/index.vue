<template>
  <p-modal
    :maskClosable="false"
    title="项目关闭"
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
      <p-form-model-item label="关闭类型" prop="fdProjectStatus">
        <select-close-type
          placeholder="请选择"
          :value="
            !!tempValue.fdProjectStatus ? [{ value: tempValue.fdProjectStatus }] : []
          "
          allow-clear
          @change="tempValue.fdProjectStatus = ($event[0] || {}).value"
        />
      </p-form-model-item>
      <p-form-model-item label="关闭原因" prop="fdCloseExplain">
        <p-textarea
          v-model="tempValue.fdCloseExplain"
          placeholder="请输入"
          :maxLength="500"
          :autoSize="{
            minRows: 4,
          }"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit" :loading="loading">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectCloseType from '../select/close-type';
import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectStatus: '',
    fdCloseExplain: '',
  },
});

export default {
  name: 'project-close',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SelectCloseType,
  },
  data() {
    return {
      loading: false,
      rules: {
        fdProjectStatus: [
          { required: true, message: '请选择关闭类型', trigger: 'change' },
        ],
        fdCloseExplain: [{ required: true, message: '请输入关闭原因', trigger: 'blur' }],
      },
    };
  },
  methods: {
    handleChange(e) {
      this.tempValue.card = e.fileList.map((d) => ({
        ...d,
        ...((d.response || {}).data || {}),
      }));
    },
    handleSubmit() {
      if (!this.moduleId) {
        return;
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单?',
          onOk: async () => {
            this.loading = true;

            try {
              await api.business.postCloseProject({
                id: this.moduleId,
                fdCloseExplain: this.tempValue.fdCloseExplain,
                fdProjectStatus: this.tempValue.fdProjectStatus,
              });
              this.$message.success('项目关闭成功');
              this.onOk();
            } finally {
              this.loading = false;
            }
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
