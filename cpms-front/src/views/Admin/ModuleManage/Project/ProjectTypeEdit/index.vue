<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
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
              <p-breadcrumb-item>
                项目类型{{ isEdit ? '升级' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleSubmit" :loading="loading">
              {{ isEdit ? '升级' : '提交' }}
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="项目类型信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="项目类型名称" prop="fdName">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdName"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item
                label="可使用范围-部门"
                prop="sysDatascopeDeptAspectParams"
              >
                <p-select-org
                  orgType="1"
                  :selectData="
                    formData.sysDatascopeDeptAspectParams.map((d) => ({
                      code: d.fdDeptId,
                      name: d.fdDeptName,
                    }))
                  "
                  @confirm="
                    formData.sysDatascopeDeptAspectParams = $event.map((d) => ({
                      fdDeptId: d.code,
                      fdDeptName: d.name,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item
                label="可使用范围-人员"
                prop="sysDatascopePersonAspectParams"
              >
                <p-select-user
                  orgType="1"
                  :selectData="
                    formData.sysDatascopePersonAspectParams.map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.sysDatascopePersonAspectParams = $event.map((d) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <stage-list style="margin-top: 16px" v-model="formData" />

        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ isEdit ? '升级' : '提交' }}
          </p-button>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from './form';
import StageList from './stage-list';

export default {
  name: '项目类型编辑',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  components: {
    StageList,
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
    handleSubmit() {
      if (this.loading) {
        return;
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        if (!this.checkFormData(this.formData)) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单?',
          onOk: () => {
            this.submitFormData(this.formData, this.isEdit);
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
