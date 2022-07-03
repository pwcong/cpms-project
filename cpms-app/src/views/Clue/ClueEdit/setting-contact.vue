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
          title="其他联系人设置"
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
                v-model="tempValue.fdContactName"
                name="tempValue.fdContactName"
                label="姓名"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入姓名` }]"
              />

              <van-field
                v-model="tempValue.fdContactPhone"
                name="tempValue.fdContactPhone"
                label="手机号"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入手机号` }]"
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
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdContactName: '',
    fdContactPhone: '',
  },
});

export default {
  name: 'setting-contact',
  mixins: [selectionMixin],
  components: {},
  data() {
    return {};
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.tempValue = {
        ...this.tempValue,
        fdPercentageComplete: this.fdPercentageComplete,
      };
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
