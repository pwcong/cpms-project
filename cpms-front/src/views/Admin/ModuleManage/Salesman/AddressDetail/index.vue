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
              <p-breadcrumb-item>业务员模块</p-breadcrumb-item>
              <p-breadcrumb-item>考勤地址详情</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleEdit(formData.id)"> 编辑 </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="打卡地址缩写" prop="fdClockAddressAcronym">
                <p-input v-model="formData.fdClockAddressAcronym" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="打卡地址" prop="fdClockAddress">
                <p-input v-model="formData.fdClockAddress" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="可使用范围-部门" prop="fdDeptCode">
                <p-input
                  :value="
                    formData.sysDatascopeDeptAspectParams.map((d) => d.name).join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="可使用范围-人员">
                <p-input
                  :value="
                    formData.sysDatascopePersonAspectParams.map((d) => d.name).join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="打卡有效范围(米)" prop="fdClockScope">
                <p-input-number
                  read-only
                  style="width: 100%"
                  v-model="formData.fdClockScope"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否有效" prop="fdIsValid">
                <p-input
                  read-only
                  style="width: 100%"
                  :value="formData.fdIsValid === '1' ? '是' : '否'"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from '../AddressEdit/form';

export default {
  name: '考勤地址详情',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
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
  methods: {},
};
</script>

<style lang="scss" scoped></style>
