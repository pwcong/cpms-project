<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>后台管理</p-breadcrumb-item>
              <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
              <p-breadcrumb-item>项目模块</p-breadcrumb-item>
              <p-breadcrumb-item>项目阶段详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleEdit(id)"> 编辑 </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block title="项目阶段信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="项目阶段名称" prop="fdName">
                <p-input read-only v-model="formData.fdName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="默认完成比例" prop="fdCompletePercentage">
                <p-input read-only v-model="formData.fdCompletePercentage" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <cmpt-list readOnly style="margin-top: 16px" v-model="formData" />
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from '../ProjectStageEdit/form';
import CmptList from '../ProjectStageEdit/cmpt-list';

export default {
  name: '项目阶段详情',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },
  components: {
    CmptList,
  },
  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
};
</script>
