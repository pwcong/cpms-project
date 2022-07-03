<template>
  <p-modal
    :maskClosable="false"
    title="千里马导入"
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
      <p-form-model-item label="数据文件" prop="files">
        <p-upload
          name="file"
          action="/api/cpms/clueMain/qianlima-excel-import"
          :file-list="tempValue.files"
          :beforeUpload="beforeChange"
          @change="handleChange"
        >
          <div v-if="tempValue.files.length <= 0">
            <p-button>
              <p-icon type="upload" />
              <span>点击上传</span>
            </p-button>
          </div>
        </p-upload>
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <!-- <p-button @click="onCancel">取 消</p-button> -->
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    files: [],
  },
});

export default {
  name: 'qianlima-import',
  mixins: [selectionMixin],
  data() {
    return {
      rules: {},
    };
  },
  methods: {
    handleChange(e) {
      this.tempValue.files = e.fileList
        .map((d) => ({
          ...(d.response || {}),
          ...d,
        }))
        .filter((d) => {
          if (!!d.response && d.response.code !== 0) {
            this.$message.error(d.response.msg);
            return false;
          }
          return true;
        });
    },
    beforeChange(file, fileList) {
      return new Promise((resolve, reject) => {
        this.$confirm({
          title: '是否千里马导入线索?',
          onOk: () => {
            resolve(file);
          },
          onCancel: () => {
            reject();
          },
        });
      });
    },
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
