<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar
          :class="className"
          title="跟进记录设置"
          left-text="取消"
          left-arrow
          right-text="保存"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                v-model="tempValue.fdRecord"
                name="tempValue.fdRecord"
                label="跟进记录信息"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入跟进记录信息` }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdRecord: '',
  },
});

export default {
  name: 'setting-follow',
  mixins: [selectionMixin],
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      this.tempValue = {
        ...this.tempValue,
      };

      await api.common.postFollowRecord({
        fdRelateModule: this.moduleFlag,
        fdRelateModuleId: this.moduleId,
        ...this.tempValue,
      });

      this.$toast.success({
        message: `跟进记录新增成功`,
      });

      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
