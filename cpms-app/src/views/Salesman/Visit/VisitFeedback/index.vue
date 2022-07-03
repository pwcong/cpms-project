<template>
  <list-layout class="page-visitfeedback-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`拜访反馈${isEdit ? '编辑' : '新建'}`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit">
          <block>
            <van-field
              v-model="formData.fdModuleType"
              name="formData.fdModuleType"
              :label="`${moduleName}名称`"
              placeholder="请输入"
            />
            <van-field
              v-model="formData.fdVisitName"
              name="formData.fdVisitName"
              label="实际拜访人姓名"
              placeholder="请输入"
              required
              :rules="[{ required: true, message: `请输入实际拜访人姓名` }]"
            />
            <van-field
              v-model="formData.fdVisitMobile"
              name="formData.fdVisitMobile"
              label="实际拜访人电话"
              placeholder="请输入"
              required
              :rules="[{ required: true, message: `请输入实际拜访人电话` }]"
            />
            <van-field
              v-model="formData.fdVisitJob"
              name="formData.fdVisitJob"
              label="实际拜访人职务"
              placeholder="请输入"
              required
              :rules="[{ required: true, message: `请输入实际拜访人职务` }]"
            />
            <van-field
              v-model="formData.fdProjectFeedback"
              name="formData.fdProjectFeedback"
              label="反馈内容"
              placeholder="请输入"
              required
              type="textarea"
              :row="3"
              :rules="[{ required: true, message: `请输入反馈内容` }]"
            />

            <van-field readonly label="上传图片" :value="(formData.sysAttContractAspectParams[0] || {}).value">
              <picture-uploader mode="picture" slot="input" multiple v-model="formData.sysAttContractAspectParams" />
            </van-field>
          </block>
          <project-list v-if="formData.fdVisitFeedbackType === 'cust'" v-model="formData" />
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <van-button :loading="loading" block type="danger" @click="handleSubmit"> 提交 </van-button>
      </div>
    </template>
  </list-layout>
</template>

<script>
import formMixin from './form';
import { userMixin } from '@/mixins';
import ProjectList from './project-list';

export default {
  mixins: [userMixin, formMixin],
  components: {
    ProjectList,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    onSubmit() {
      if (!!this.loading || !this.checkFormData(this.formData)) {
        return;
      }
      this.$dialog
        .confirm({
          title: '是否确认提交表单?',
        })
        .then(() => {
          this.submitFormData(this.formData, this.isEdit);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.page-visitfeedback-edit {
}
</style>
