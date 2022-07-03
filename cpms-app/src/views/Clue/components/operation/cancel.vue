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
          title="作废操作"
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
                v-model="tempValue.fdDiscardDescription"
                name="fdDiscardDescription"
                label="作废理由"
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
    fdDiscardDescription: '',
  },
});

export default {
  name: 'operation-cancel',
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
          title: '请确认是否要作废此线索?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.clue.putDiscardClue({
              deleteParamList: [
                {
                  id: this.moduleId,
                  version: this.version,
                },
              ],
              ...this.tempValue,
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
