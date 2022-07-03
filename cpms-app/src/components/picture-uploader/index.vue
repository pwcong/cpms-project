<template>
  <div class="picture-uploader">
    <div
      :class="{
        'picture-uploader-wrapper': true,
        [`mode--${mode}`]: true,
      }"
    >
      <div class="picture-item" v-for="(item, index) in tempValue" :key="index">
        <van-loading v-if="item.loading" />
        <template v-if="mode === 'picture'">
          <van-image
            class="picture"
            v-if="!item.loading"
            width="70px"
            height="70px"
            fit="conver"
            :src="getUrl(item)"
            @click="handlePreview(item)"
          />
          <van-icon class="delete" v-if="!item.loading && !readonly" name="cross" @click="handleDel(item, index)" />
        </template>
        <template v-else>
          <div class="picture">
            <van-icon style="margin-right: 4px" v-if="!item.loading" name="orders-o" />
            <div class="name" v-if="!item.loading" @click="handlePreview(item)">
              {{ item.value }}
            </div>
            <van-icon v-if="!item.loading && !readonly" class="delete" name="delete" @click="handleDel(item, index)" />
          </div>
        </template>
      </div>

      <template v-if="!readonly && canUpload">
        <div v-if="mode === 'picture'" class="picture-item" @click="showActions = true">
          <van-icon name="photograph" />
        </div>
        <van-button v-else size="mini" plain type="danger" @click="showActions = true" native-type="button">
          上传图片
        </van-button>
      </template>
    </div>

    <van-action-sheet
      v-model="showActions"
      :actions="uploadActions"
      @select="onSelect"
      cancel-text="取消"
      close-on-click-action
      :get-container="selectionContainer"
    />

    <div v-if="!!description" class="picture-description">
      {{ description }}
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import { post } from 'poros/http';
import api from '@/api';
import config from '@/config';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'picture-uploader',
  mixins: [selectionMixin],
  props: {
    description: {
      type: String,
    },
    deleteValue: {
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
    max: {
      type: Number,
    },
    onPreview: {
      type: Function,
    },
    actions: {
      type: Array,
      default: () => [1, 2],
    },
  },
  data() {
    return {
      showActions: false,
    };
  },
  computed: {
    uploadActions() {
      let result = [];

      if (this.actions.indexOf(1) > -1) {
        result.push({ name: '拍照', value: 1 });
      }
      if (this.actions.indexOf(2) > -1) {
        result.push({ name: '本地上传', value: 2 });
      }

      return result;
    },
    canUpload() {
      if ((!this.multiple && this.tempValue.length >= 1) || (this.multiple && this.tempValue.length >= this.max)) {
        return false;
      }

      return true;
    },
  },
  methods: {
    getUrl(item) {
      const url = `${config.baseUrl[config.env]}${item.path}`;
      return url;
    },
    onSelect(item) {
      this.$nativeApi
        .getPicture({
          // Camera.PictureSourceType 1:CAMERA 2:SAVEDPHOTOALBUM
          sourceType: item.value,
        })
        .then(async (imgObj) => {
          const newPicture = {
            ...imgObj,
            loading: true,
          };

          try {
            this.tempValue.push(newPicture);

            const filename = `${new Date().getTime()}.jpeg`;

            console.log(newPicture);

            const res = await post('/api/cpms/sysAtt/upload/base64', {
              content: newPicture.base64Url,
              name: filename,
            });

            newPicture.text = filename;
            newPicture.value = res.data;
            newPicture.loading = false;

            const detail = await api.common.getFileDetail({
              id: newPicture.value,
            });

            newPicture.path = detail.fdPath;

            this.tempValue = [...this.tempValue];

            this.onOk();
            this.$emit('update:addValue', this.addValue.concat([newPicture]));
          } catch (e) {
            this.$toast.fail({
              message: '图片上传失败',
            });
            this.tempValue = this.tempValue.filter((v) => v !== newPicture);
          }
        });

      this.showActions = false;
    },
    handleDel(item, index) {
      this.$dialog
        .confirm({
          title: '是否确认删除该文件?',
        })
        .then(() => {
          this.tempValue.splice(index, 1);
          this.onOk();
          this.$emit('update:deleteValue', this.deleteValue.concat([item]));
        });
    },
    async handlePreview(item) {
      const loading = this.$toast.loading({
        message: '获取附件中',
        forbidClick: true,
        duration: 0,
      });

      try {
        const detail = await api.common.getFileDetail({
          id: item.value,
        });

        const url = this.getUrl({
          ...item,
          path: detail.fdPath,
        });

        if (this.onPreview) {
          this.onPreview(url);
        } else if (config.env !== 'local') {
          this.$nativeApi.previewFile(url);
        } else {
          console.log('图片预览', url);
        }
      } finally {
        loading.clear();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.picture-uploader {
  overflow: hidden;
  max-width: 100%;
  .picture-description {
    font-size: 10px;
    color: #999999;
    width: 100%;
    line-height: 14px;
    margin-top: 8px;
  }

  &-wrapper.mode--picture {
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    .picture-item {
      width: 70px;
      height: 70px;
      background-color: #f7f8fa;
      text-align: center;
      font-size: 20px;
      line-height: 70px;
      position: relative;
      color: #999999;
      &:not(:last-child) {
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .delete {
        background-color: $theme-color;
        color: white;
        font-size: 14px;
        position: absolute;
        right: 0.01px;
        top: 0.01px;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
      }
    }
  }

  &-wrapper.mode--file {
    overflow: hidden;

    .picture-item {
      padding: 2px;
      font-size: 12px;
      color: #666666;
    }

    .picture {
      display: flex;
      align-items: center;
      position: relative;
      flex-flow: row nowrap;
      overflow: hidden;

      .name {
        flex: 1;
      }

      .delete {
        color: $theme-color;
        font-size: 16px;
      }
    }
  }

  .picture-preview {
    img {
      max-width: 80vw;
      max-height: 80vh;
    }
  }
}
</style>
