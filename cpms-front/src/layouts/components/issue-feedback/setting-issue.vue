<template>
  <p-modal
    :maskClosable="false"
    title="问题反馈"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <block title="问题详情" theme="primary">
        <p-row style="margin-top: 16px" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="提问者姓名" prop="fdUserName">
              <p-input
                readOnly
                :maxLength="200"
                v-model="tempValue.fdUserName"
                :placeholder="isEdit ? '请输入' : undefined"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="提问者手机号" prop="fdMobile">
              <p-input
                readOnly
                :maxLength="200"
                v-model="tempValue.fdMobile"
                :placeholder="isEdit ? '请输入' : undefined"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="提问者邮箱" prop="fdEmail">
              <p-input
                readOnly
                :maxLength="200"
                v-model="tempValue.fdEmail"
                :placeholder="isEdit ? '请输入' : undefined"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="24">
            <p-form-model-item label="问题描述" prop="fdDesc">
              <p-textarea
                :readOnly="!isEdit"
                :maxLength="500"
                v-model="tempValue.fdDesc"
                :placeholder="isEdit ? '请输入' : undefined"
                :autoSize="{ minRows: 4 }"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="24">
            <p-form-model-item label="问题图片" prop="fdPicture">
              <uploader
                mode="picture"
                multiple
                :readOnly="!isEdit"
                v-model="tempValue.fdPicture"
                accept="image/*"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="24">
            <p-form-model-item label="问题附件" prop="sysAttContractAspectParams">
              <uploader
                :readOnly="!isEdit"
                multiple
                v-model="tempValue.sysAttContractAspectParams"
              />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block
        title="处理结果"
        theme="primary"
        v-if="!!tempValue.fdStatus && tempValue.fdStatus !== 'todo'"
      >
        <p-row style="margin-top: 16px" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="问题状态" prop="fdStatus">
              <p-input readOnly :value="tempValue.fdStatusName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="处理人姓名" prop="fdHandleUserName">
              <p-input readOnly v-model="tempValue.fdHandleUserName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="24" v-if="tempValue.fdStatus !== 'handle'">
            <p-form-model-item
              :label="tempValue.fdStatus === 'close' ? '关闭原因' : '解决方案'"
              prop="fdHandleResult"
            >
              <p-textarea
                readOnly
                v-model="tempValue.fdHandleResult"
                :autoSize="{ minRows: 4 }"
              />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
    </p-form-model>
    <span slot="footer">
      <template v-if="mode === 'add'">
        <p-button @click="onCancel">取 消</p-button>
        <p-button :loading="loading" type="primary" @click="handleSubmit(true)">
          提 交
        </p-button>
      </template>
      <template v-if="mode === 'view'">
        <p-button @click="onCancel">关 闭</p-button>
      </template>
    </span>
  </p-modal>
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
  fdPicture: [],
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
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        !!v && this.handleInit();
      },
    },
  },
  computed: {
    isEdit() {
      return ['add', 'edit'].indexOf(this.mode) > -1;
    },
    rules() {
      return {
        fdUserName: [
          {
            required: this.isEdit,
            message: '请输入提问者姓名',
            trigger: 'blur',
          },
        ],
        fdMobile: [
          {
            required: this.isEdit,
            message: '请输入提问者手机号',
            trigger: 'blur',
          },
        ],
        fdDesc: [
          {
            required: this.isEdit,
            message: '请输入问题描述',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  data() {
    return {
      loading: false,
      attKey: 'COMMON_QUESTION',
      picKey: 'COMMON_QUESTION_PIC',
    };
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

        const picList = await api.common
          .getFileList({
            attKey: this.picKey,
            moudleId: this.moduleId,
          })
          .then((res) => res.data || []);

        this.tempValue.sysAttContractAspectParams = fileList.map((d) => ({
          text: d.fdFileName,
          value: d.id,
          path: d.fdPath,
        }));

        this.tempValue.fdPicture = picList.map((d) => ({
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
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单?',
          onOk: async () => {
            this.loading = true;
            try {
              await api.common.postQuestionForm({
                ...this.tempValue,
                fdStatus: 'todo',
                sysAttContractAspectParams: (
                  this.tempValue.sysAttContractAspectParams || []
                )
                  .map((d) => ({
                    fdAttFileId: d.value,
                    fdAttKey: this.attKey,
                  }))
                  .concat(
                    (this.tempValue.fdPicture || []).map((d) => ({
                      fdAttFileId: d.value,
                      fdAttKey: this.picKey,
                    }))
                  ),
              });

              this.$message.success('问题反馈成功');
              this.onOk();
            } finally {
              this.loading = false;
            }
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
