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
          title="OA信息设置"
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
                :required="requiredMap['fdAuditNote']"
                v-model="tempValue.fdAuditNote"
                name="fdAuditNote"
                label="审批意见"
                placeholder="请输入"
                type="textarea"
                :rules="[{ required: requiredMap['fdAuditNote'], message: '请输入审批意见' }]"
              >
              </van-field>
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import mixin, { EStatus } from './mixin';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdAuditNote: '',
  },
});

export default {
  name: 'setting-oa',
  mixins: [selectionMixin, mixin],
  computed: {
    requiredMap() {
      return {
        fdAuditNote: [this.statusMap[EStatus.reject]].indexOf(this.status) > -1,
      };
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
