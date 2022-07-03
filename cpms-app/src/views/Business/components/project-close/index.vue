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
          title="项目关闭"
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
                v-model="tempValue.fdProjectStatusName"
                name="fdProjectStatusName"
                label="关闭类型"
                placeholder="请选择"
                readonly
                clickable
                is-link
                @click="showCloseType = true"
                required
                :rules="[{ required: true, message: '请选择关闭类型' }]"
              />
              <van-field
                v-model="tempValue.fdCloseExplain"
                name="fdCloseExplain"
                label="关闭原因"
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

      <selection-close-type
        title="选择关闭类型"
        :visible.sync="showCloseType"
        @change="handleChangeCloseType"
        :value="!!tempValue.fdProjectStatus ? [{ value: tempValue.fdProjectStatus }] : []"
      />
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import SelectionCloseType from '../selection/close-type';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectStatus: '',
    fdProjectStatusName: '',
    fdCloseExplain: '',
  },
});

export default {
  name: 'project-close',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SelectionCloseType,
  },
  data() {
    return {
      loading: false,
      showCloseType: false,
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
          title: '是否确认关闭项目?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.business.postCloseProject({
              id: this.moduleId,
              fdCloseExplain: this.tempValue.fdCloseExplain,
              fdProjectStatus: this.tempValue.fdProjectStatus,
              fdIsValid: '1',
            });

            this.onOk();
          } finally {
            this.loading = false;
          }
        });
    },
    handleChangeCloseType(res) {
      this.tempValue.fdProjectStatus = (res[0] || {}).value;
      this.tempValue.fdProjectStatusName = (res[0] || {}).text;
    },
  },
};
</script>
<style lang="scss" scoped></style>
