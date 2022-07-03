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
          title="拜访计划设置"
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
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdProjectName"
                name="tempValue.fdProjectName"
                label="项目名称"
                placeholder="请选择"
                @click="showProject = true"
                :rules="[{ required: true, message: `请选择项目名称` }]"
              />
              <van-field
                v-model="tempValue.fdProjectFeedback"
                name="tempValue.fdProjectFeedback"
                label="反馈内容"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入反馈内容` }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <selection-project
      searchable
      status="todo,audit,follow,done"
      title="选择项目"
      :customerId="customerId"
      :visible.sync="showProject"
      @change="handleChangeProject"
      :value="!!tempValue.fdProjectId ? [{ value: tempValue.fdProjectId }] : []"
    />
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

import SelectionProject from '@/views/components/selection/project';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectId: '',
    fdProjectName: '',
    fdProjectFeedback: '',
  },
});

export default {
  name: 'setting-project',
  mixins: [selectionMixin],
  props: {
    customerId: {
      type: String,
    },
  },
  components: {
    SelectionProject,
  },
  data() {
    return {
      showProject: false,
    };
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}项目状态`;
    },
  },
  methods: {
    handleChangeProject(res) {
      this.tempValue.fdProjectId = (res[0] || {}).value;
      this.tempValue.fdProjectName = (res[0] || {}).text;
    },
    handleSubmit() {
      this.$refs.form.submit();
    },

    onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
