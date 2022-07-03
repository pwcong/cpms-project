<template>
  <div
    :class="{
      uploader: true,
      [`uploader--${mode}`]: true,
      [`uploader--empty`]: tempValue.length <= 0,
    }"
  >
    <div class="uploader-wrapper">
      <div class="uploader-t">
        <div class="uploader-list" v-if="tempValue.length > 0">
          <div class="uploader-item" v-for="(item, index) in tempValue" :key="index">
            <template v-if="mode === 'file'">
              <div class="uploader-file" @click="handlePreview(item, index)">
                <van-loading v-if="item.loading" />
                <template v-else>
                  <van-icon class="uploader-file-icon" name="orders-o" />
                  <span class="uploader-file-name">
                    {{ item.text }}
                  </span>
                  <div class="uploader-file-btns" v-if="!readonly">
                    <van-button size="mini" type="danger" @click.stop="handleDel(item, index)" native-type="button">
                      删除
                    </van-button>
                  </div>
                </template>
              </div>
            </template>
            <template v-if="mode === 'picture'">
              <div class="uploader-picture" @click="handlePreview(item, index)">
                <van-loading v-if="item.loading" />
                <template v-else>
                  <div
                    class="uploader-picture-img"
                    :style="{
                      backgroundImage: `url(${getUrl(item)})`,
                    }"
                  ></div>
                  <div class="uploader-picture-btns" v-if="!readonly">
                    <van-icon name="clear" @click.stop="handleDel(item, index)" />
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
        <div v-else-if="readonly" class="uploader-empty">&lt;无&gt;</div>
      </div>
      <div class="uploader-b" v-if="!readonly">
        <label class="uploader-btn" v-if="allowUpload">
          <span>
            {{ uploadText }}
          </span>
          <input :accept="uploadAccept" style="display: none" type="file" @change="handleChange" />
        </label>
        <div class="uploader-tips" v-if="description">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import http from 'poros/http';
import api from '@/api';
import config from '@/config';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const MODE = {
  file: 'file',
  picture: 'picture',
};

export default {
  name: 'uploader',
  mixins: [selectionMixin],
  props: {
    name: {
      type: String,
      default: 'file',
    },
    mode: {
      type: String,
      default: MODE.picture,
    },
    description: {
      type: String,
    },
    delValue: {
      type: Array,
      default: () => [],
    },
    addValue: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    uploadAccept() {
      switch (this.mode) {
        case MODE.picture:
          return 'image/*';
        default:
          return '*';
      }
    },
    uploadText() {
      switch (this.mode) {
        case MODE.picture:
          return '上传图片';
        default:
          return '上传文件';
      }
    },
    allowUpload() {
      return this.multiple || (!this.multiple && this.tempValue.length <= 0);
    },
  },
  methods: {
    getUrl(item) {
      const url = `${config.baseUrl[config.env]}${item.path}`;
      return url;
    },
    async handlePreview(item, index) {
      const loading = this.$toast.loading({
        message: '获取附件详情中',
        duration: 0,
        forbidClick: true,
      });

      try {
        const data = await api.common.getFileDetail({
          id: item.value,
        });

        this.$nativeApi.previewFile(
          this.getUrl({
            path: data.fdPath,
          })
        );
      } finally {
        loading.clear();
      }
    },
    handleDel(item, index) {
      this.$dialog
        .confirm({
          title: '是否确认删除该文件',
        })
        .then(() => {
          this.tempValue = this.tempValue.filter((d) => d.value !== item.value);
          const delValue = this.delValue.filter((d) => d.value !== item.value);

          this.onOk();
          this.$emit('update:delValue', delValue);
        });
    },
    async handleChange(event) {
      const file = (event.target.files || [])[0];
      if (!file) {
        return;
      }

      const newItem = {
        text: file.name,
        value: '',
        path: '',
        loading: true,
      };

      try {
        this.tempValue.push(newItem);
        newItem.value = await this.uploadFile(file);
        const data = await api.common.getFileDetail({
          id: newItem.value,
        });
        newItem.path = data.fdPath;
        newItem.loading = false;

        this.tempValue = [...this.tempValue];
        const addValue = this.addValue.concat(newItem);
        this.onOk();
        this.$emit('update:addValue', addValue);
      } catch (e) {
        this.$toast.fail({
          message: `${this.uploadText}失败`,
        });
        this.tempValue = this.tempValue.filter((v) => v !== newItem);
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append(this.name, file);

      const res = await http
        .request({
          url: '/api/cpms/sysAtt/upload',
          method: 'post',
          data: formData,
        })
        .then((res) => res.data);

      return res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.uploader {
  width: 100%;
  font-size: 12px;

  &-b {
    margin-top: 8px;
  }

  &--empty &-b {
    margin-top: 0;
  }

  &-btn {
    display: inline-block;
    margin-bottom: 4px;
    span {
      color: $theme-color;
      padding: 4px 6px;
      border: 1px solid $theme-color;
      border-radius: 2px;
    }
  }

  &-tips {
    color: #999999;
  }

  &-file {
    width: 100%;
    height: 32px;
    position: relative;
    &-icon,
    &-name,
    &-btns {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    &-icon {
      left: 0;
      color: $theme-color;
      font-size: 16px;
    }

    &-name {
      left: 18px;
      flex: 1;
      margin: 0 4px;
      width: calc(100% - 72px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-btns {
      font-size: 0;
      right: 0;
    }
  }

  &-picture {
    border-radius: 3px;
    position: relative;
    border: 1px solid #eeeeee;
    margin-right: 4px;
    margin-bottom: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    &-img {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      width: 80px;
      height: 80px;
    }

    &-btns {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      padding: 2px;
    }
  }

  &--picture .uploader-list {
    display: flex;
    flex-flow: row wrap;
  }

  &-empty {
    color: #aaaaaa;
  }
}
</style>
