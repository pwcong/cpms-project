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
          title="更换负责人"
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
                v-model="tempValue.fdUserName"
                name="fdUserName"
                label="负责人"
                placeholder="请选择"
                readonly
                clickable
                is-link
                @click="showUser = true"
                required
                :rules="[{ required: true, message: '请选择负责人' }]"
              />
            </block>
          </van-form>
        </div>
      </template>

      <selection-user
        title="选择负责人"
        :visible.sync="showUser"
        @change="handleSelectUser"
        searchable
        :value="tempValue.fdLoginName ? [{ value: tempValue.fdLoginName, text: tempValue.fdUserName }] : []"
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
    fdLoginName: '',
    fdUserName: '',
  },
});

export default {
  name: 'project-change-manager',
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
      showUser: false,
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
            await api.business.postChangeProjectManager({
              id: this.moduleId,
              fdLoginName: this.tempValue.fdLoginName,
              fdUserName: this.tempValue.fdUserName,
            });

            this.$toast.success({
              message: '更换负责人成功',
            });

            this.onOk();
          } finally {
            this.loading = false;
          }
        });
    },
    handleSelectUser(res) {
      this.tempValue.fdLoginName = (res[0] || {}).uid;
      this.tempValue.fdUserName = (res[0] || {}).name;
    },
  },
};
</script>
<style lang="scss" scoped></style>
