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
          title="问题解决"
          left-text="取消"
          left-arrow
          right-text="确定"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                v-model="tempValue.fdHandleResult"
                name="fdHandleResult"
                label="解决方案"
                type="textarea"
                :maxLength="500"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: '请输入关闭原因' }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdHandleResult: '',
  },
});

export default {
  name: 'question-solved',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    version: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      if (this.loading) {
        return;
      }

      this.$dialog
        .confirm({
          title: '是否确认提交表单?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.common.putQuestionForm({
              ...this.tempValue,
              id: this.moduleId,
              fdStatus: 'solved',
              fdHandleUserName: this.name,
              fdHandleLoginName: this.uid,
            });

            this.onOk();
          } finally {
            this.loading = false;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
