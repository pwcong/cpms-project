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
              <p-breadcrumb-item>业务员模块</p-breadcrumb-item>
              <p-breadcrumb-item
                >考勤地址{{ isEdit ? '编辑' : '新建' }}</p-breadcrumb-item
              >
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button type="primary" @click="handleSubmit()" :loading="loading">
              {{ isEdit ? '保存' : '提交' }}
            </p-button>
            <!-- <p-button
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
            >
              暂存
            </p-button> -->
            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="打卡地址缩写" prop="fdClockAddressAcronym">
                <p-input
                  v-model="formData.fdClockAddressAcronym"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="打卡地址" prop="fdClockAddress">
                <p-input
                  v-model="formData.fdClockAddress"
                  placeholder="请选择"
                  @click="showMap = true"
                  readOnly
                >
                </p-input>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="可使用范围-部门" prop="fdDeptCode">
                <p-select-org
                  orgType="1"
                  :selectData="formData.sysDatascopeDeptAspectParams"
                  @confirm="handleConfirm"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="可使用范围-人员">
                <p-select-user
                  :selectData="formData.sysDatascopePersonAspectParams"
                  @confirm="handleconfirm"
                />
              </p-form-model-item>
            </p-col>
            <!-- <p-col :span="12">
            <p-form-model-item label="可使用范围-角色">
              <p-select-user />
            </p-form-model-item>
          </p-col> -->
            <p-col :span="8">
              <p-form-model-item label="打卡有效范围(米)" prop="fdClockScope">
                <p-input-number
                  style="width: 100%"
                  v-model="formData.fdClockScope"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否有效" prop="fdIsValid">
                <select-yes-or-no
                  :value="!!formData.fdIsValid ? [{ value: formData.fdIsValid }] : []"
                  placeholder="请选择"
                  @change="formData.fdIsValid = $event[0].value"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit()"
            :loading="loading"
          >
            {{ isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>
      <selection-amap :visible.sync="showMap" @change="handleSelectAddress" />
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from './form';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

export default {
  name: '考勤地址编辑',
  mixins: [formMixin],
  components: {
    SelectYesOrNo,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showMap: false,
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
    handleSubmit(isDraft) {
      if (this.loading) {
        return;
      }

      const submit = () => {
        this.$confirm({
          title: '是否确认提交表单?',
          onOk: () => {
            this.submitFormData({
              ...this.formData,
              fdStatus: isDraft ? 0 : 1,
            });
          },
          onCancel: () => {},
        });
      };

      if (isDraft) {
        submit();
      } else {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            this.$message.error('表单字段校验未通过');
            return;
          }

          if (!this.checkFormData(this.formData)) {
            return;
          }
          submit();
        });
      }
    },
    handleSelectAddress(value) {
      value = value[0];
      if (!value) {
        return;
      }

      this.formData = {
        ...this.formData,
        fdClockAddress: value.text,
        fdProvinceName: value.data.addressComponent.province,
        fdCityName: value.data.addressComponent.city.toString(),
        fdCountyName: value.data.addressComponent.district,
        fdLongitudeF: value.value.split(',')[0],
        fdLatitudeF: value.value.split(',')[1],
        fdAdcode: value.data.addressComponent.adcode,
        fdIsValid: 1,
        version: 0,
      };
    },
    //部门
    handleConfirm(value) {
      this.formData.sysDatascopeDeptAspectParams = value;
    },
    //人员
    handleconfirm(value) {
      this.formData.sysDatascopePersonAspectParams = value;
    },
  },
};
</script>

<style lang="scss" scoped></style>
