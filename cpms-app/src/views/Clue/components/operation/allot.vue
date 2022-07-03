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
          title="分配人员"
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
                :max="1"
                :value="tempValue.fdUserName"
                is-link
                label="选择分配人员"
                placeholder="请选择"
                @click="showFollow = true"
              />
            </block>
          </van-form>
        </div>
      </template>
      <selection-user
        searchable
        :visible.sync="showFollow"
        :value="!!tempValue.fdLoginName ? [{ value: tempValue.fdLoginName }] : []"
        title="选择分配人员"
        @change="handleSelectFollow"
      />
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'operation-allot',
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
      showFollow: false,
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
          title: '请确认是否要分配此线索?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.clue.putAllotClue({
              allotEditParam: [
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
    handleSelectFollow(res) {
      this.tempValue.fdLoginName = (res[0] || {}).uid;
      this.tempValue.fdUserName = (res[0] || {}).name;
    },
  },
};
</script>
<style lang="scss" scoped></style>
