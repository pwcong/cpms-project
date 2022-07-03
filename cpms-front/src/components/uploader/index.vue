<template>
  <div class="uploader">
    <template v-if="readOnly">
      <template v-if="(tempValue || []).length > 0">
        <div class="uploader-item" v-for="(item, index) in tempValue" :key="index">
          <div class="uploader-item-wrapper" @click="handlePreview(item)">
            <p-icon type="link" />
            <span>
              {{ item.text }}
            </span>
          </div>
        </div>
      </template>
      <div v-else>
        <span style="color: #999999">&lt; 无 &gt;</span>
      </div>
    </template>
    <template v-else>
      <p-upload
        :name="name"
        :multiple="multiple"
        action="/api/cpms/sysAtt/upload"
        @change="handleChange"
        @preview="handlePreview"
        :file-list="targetValue"
        list-type="text"
        :disabled="readOnly"
        :accept="accept"
        :data="data"
        :beforeUpload="handleBeforeUpload"
      >
        <template v-if="multiple || (!multiple && targetValue.length <= 0)">
          <p-button>
            <p-icon type="upload" />
            <span>点击上传</span>
          </p-button>
        </template>
      </p-upload>
    </template>

    <p-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img alt="图片预览" style="width: 100%" :src="previewImage" />
    </p-modal>
  </div>
</template>
<script>
import { buildSelectionMixin } from '@/mixins';
import api from '@/api';
import { downloadByLink } from '@/utils/file';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'uploader',
  mixins: [selectionMixin],
  props: {
    name: {
      type: String,
      default: 'file',
    },
    multiple: {
      type: Boolean,
    },
    accept: {
      type: String,
    },
    data: {
      type: Object,
    },
    limit: {
      type: Number,
      default: 1024 * 1024 * 64,
    },
  },
  data() {
    return {
      previewVisible: false,
      previewImage: '',
    };
  },
  computed: {
    targetValue() {
      return this.tempValue
        .filter((d) => !!d)
        .map((d) => ({
          ...d,
          uid: d.uid || d.value,
          name: d.name || d.text,
          status: d.status || 'done',
        }));
    },
  },
  methods: {
    handleBeforeUpload(file) {
      // 校验文件大小
      if (file.size > this.limit) {
        this.$message.error('文件大小超过限制');
        return false;
      }

      return true;
    },
    async handlePreview(item) {
      const remove = this.$message.loading('获取附件详情中', 0);

      try {
        const data = await api.common.getFileDetail({
          id: item.value,
        });

        if (this.mode === 'picture') {
          this.previewImage = data.fdPath;
          this.previewVisible = true;
        } else {
          downloadByLink(data.fdPath, item.name || item.text);
        }
      } finally {
        remove();
      }
    },
    handleChange(info) {
      let fileList = [...info.fileList].filter((d) =>
        ['uploading', 'done'].includes(d.status)
      );

      if (!this.multiple) {
        fileList = fileList.slice(-1);
      }

      fileList = fileList
        .filter((file) => {
          const { response } = file;
          if (!!response && response.code !== 0) {
            this.$message.error(response.msg || '上传失败');
            return false;
          }
          return true;
        })
        .map((file) => {
          file = {
            ...file,
            text: file.name,
            value: file.value,
          };
          if (file.response) {
            file.value = file.response.data;
          }
          return file;
        });

      this.tempValue = fileList;

      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
.uploader {
  &-item {
    &-wrapper {
      display: flex;
      padding: 2px 0;
      align-items: center;
      cursor: pointer;
    }

    span {
      margin-left: 4px;
    }

    &:hover {
      color: #e50113;
    }
  }
}
</style>
