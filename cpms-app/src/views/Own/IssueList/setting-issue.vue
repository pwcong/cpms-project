<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout class="page-project-edit">
      <template v-slot:header="{ className }">
        <van-nav-bar
          v-if="mode === 'add'"
          :class="className"
          title="问题反馈"
          left-text="取消"
          @click-left="onCancel"
          left-arrow
          right-text="提交"
          @click-right="handleSubmit"
        />
        <van-nav-bar
          v-if="mode === 'view'"
          :class="className"
          title="问题反馈"
          left-text="关闭"
          @click-left="onCancel"
          left-arrow
        />
      </template>

      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit()">
            <block theme="primary" title="问题详情">
              <van-field
                :required="isEdit"
                :rules="[
                  {
                    required: isEdit,
                    message: '请输入提问者姓名',
                    trriger: 'blur',
                  },
                ]"
                name="fdUserName"
                :placeholder="isEdit ? '请输入' : undefined"
                readonly
                v-model="tempValue.fdUserName"
                label="提问者姓名"
              />
              <van-field
                :required="isEdit"
                :rules="[
                  {
                    required: isEdit,
                    message: '请输入提问者姓名',
                    trriger: 'blur',
                  },
                ]"
                v-model="tempValue.fdMobile"
                :placeholder="isEdit ? '请输入' : undefined"
                name="fdMobile"
                readonly
                label="提问者手机号"
              >
              </van-field>
              <van-field
                name="fdEmail"
                :placeholder="isEdit ? '请输入' : undefined"
                readonly
                v-model="tempValue.fdEmail"
                label="提问者邮箱"
              />
              <van-field
                :required="isEdit"
                :rules="[
                  {
                    required: isEdit,
                    message: '请输入提问者姓名',
                    trriger: 'blur',
                  },
                ]"
                name="fdDesc"
                :readonly="!isEdit"
                type="textarea"
                :maxlength="500"
                v-model="tempValue.fdDesc"
                :placeholder="isEdit ? '请输入' : undefined"
                label="问题描述"
              />
              <van-field
                v-if="mode === 'add'"
                readonly
                name="sysAttContractAspectParams"
                :value="(tempValue.sysAttContractAspectParams || []).map((d) => d.text).join(',')"
                label="问题附件"
              >
                <uploader
                  mode="file"
                  slot="input"
                  @input="tempValue.sysAttContractAspectParams = $event"
                  multiple
                  v-model="tempValue.sysAttContractAspectParams"
                />
              </van-field>
              <van-field
                v-if="mode === 'view'"
                readonly
                name="sysAttContractAspectParams"
                :value="(tempValue.sysAttContractAspectParams || []).map((d) => d.text).join(',')"
                label="问题附件"
              />
            </block>
            <block title="处理结果" theme="primary" v-if="!!tempValue.fdStatus && tempValue.fdStatus !== 'todo'">
              <van-field name="fdStatus" readonly v-model="tempValue.fdStatusName" label="问题状态" />
              <van-field name="fdHandleUserName" readonly v-model="tempValue.fdHandleUserName" label="处理人姓名" />
              <van-field
                name="fdHandleResult"
                type="textarea"
                :maxlength="500"
                readonly
                v-model="tempValue.fdHandleResult"
                :label="tempValue.fdStatus === 'close' ? '关闭原因' : '解决方案'"
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
import { buildSelectionMixin, userMixin } from '@/mixins';

const defaultValue = {
  fdLoginName: '',
  fdUserName: '',
  fdMobile: '',
  fdEmail: '',
  fdDesc: '',
  fdStatus: '',
  fdHandleUserName: '',
  fdHandleLoginName: '',
  fdHandleResult: '',
  sysAttContractAspectParams: [],
};
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
  // getValue: (_) => {
  //   const value = {
  //     ...defaultValue,
  //     fdLoginName: (_.user || {}).uid,
  //     fdUserName: (_.user || {}).name,
  //     fdMobile: (_.userInfo || {}).mobile,
  //     fdEmail: (_.userInfo || {}).email,
  //   };

  //   return value;
  // },
});

export default {
  name: 'setting-issue',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: String,
    // mode: String,
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        !!v && this.handleInit();
      },
    },
  },
  data() {
    return {
      loading: false,
      attKey: 'COMMON_QUESTION',
    };
  },
  computed: {
    isEdit() {
      return ['add', 'edit'].indexOf(this.mode) > -1;
    },
  },
  methods: {
    formatStatus(v) {
      const status = {
        todo: '待处理',
        solved: '已解决',
        handle: '处理中',
        close: '问题关闭',
      };
      return status[v] || '';
    },
    async handleInit() {
      if (!!this.moduleId) {
        const data = await api.common.getQuestionDetail(this.moduleId);

        this.tempValue = {
          ...defaultValue,
          ...data,
        };

        const fileList = await api.common
          .getFileList({
            attKey: this.attKey,
            moudleId: this.moduleId,
          })
          .then((res) => res.data || []);

        this.tempValue.sysAttContractAspectParams = fileList.map((d) => ({
          text: d.fdFileName,
          value: d.id,
          path: d.fdPath,
        }));
      } else {
        this.tempValue = {
          ...defaultValue,
          fdLoginName: (this.user || {}).uid,
          fdUserName: (this.user || {}).name,
          fdMobile: (this.userInfo || {}).mobile,
          fdEmail: (this.userInfo || {}).email,
        };
      }
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.$dialog
        .confirm({
          title: '是否确认提交表单?',
        })
        .then(() => {
          this.loading = true;
          try {
            api.common.postQuestionForm({
              ...this.tempValue,
              fdStatus: 'todo',
              sysAttContractAspectParams: (this.tempValue.sysAttContractAspectParams || []).map((d) => ({
                fdAttFileId: d.value,
                fdAttKey: this.attKey,
              })),
            });

            this.$toast.success('问题反馈成功');
            this.onOk();
          } finally {
            this.loading = false;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
