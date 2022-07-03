<template>
  <p-modal
    :maskClosable="false"
    :title="this.id ? '编辑' : '新增'"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-form-model-item label="角色标识" prop="fdRoleCode">
        <p-input v-model="tempValue.fdRoleCode" placeholder="请输入" />
      </p-form-model-item>

      <p-form-model-item label="描述字段" prop="fdConfigTitle">
        <p-input v-model="tempValue.fdConfigTitle" placeholder="请输入" />
      </p-form-model-item>

      <p-form-model-item label="类型标识" prop="fdTypeCode">
        <select-type-line
          :value="
            !!tempValue.fdTypeCode
              ? [
                  {
                    value: tempValue.fdTypeCode,
                    text: tempValue.fdTypeName,
                  },
                ]
              : []
          "
          placeholder="请选择"
          allow-clear
          @change="handleFdTypeCode"
        />
      </p-form-model-item>

      <p-form-model-item
        v-if="!(tempValue.fdTypeName === '部门') && !(tempValue.fdTypeName === '未知')"
        label="值范围"
        prop="sysRoleConfigValueDtoList"
      >
        <select-rule-type
          multiple
          :typeCode="tempValue.fdTypeCode"
          :value="
            (tempValue.sysRoleConfigValueDtoList || []).map((d) => ({
              value: d.fdCode,
              text: d.fdName,
            }))
          "
          placeholder="请选择"
          allow-clear
          @change="handleFdCode"
        />
      </p-form-model-item>
      <p-form-model-item
        v-else-if="tempValue.fdTypeName === '部门'"
        label="值范围"
        prop="sysRoleConfigValueDtoList"
      >
        <p-select-org
          placeholder="请选择"
          orgType="1"
          :value="
            (tempValue.sysRoleConfigValueDtoList || []).map((d) => ({
              value: d.fdCode,
              text: d.fdName,
            }))
          "
          @confirm="handleDeptCodeConfirm"
        />
      </p-form-model-item>
      <p-form-model-item
        v-if="tempValue.fdTypeName === '未知'"
        label="值范围"
        prop="fdName"
      >
        <p-input v-model="tempValue.fdName" placeholder="请输入" />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import SelectTypeLine from '../components/select/type-line';
import SelectRuleType from '../components/select/rule-type';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdTypeCode: '',
    fdTypeName: '',
    fdCode: '',
    fdName: '',
    fdRoleCode: '',
    fdConfigTitle: '',
    sysRoleConfigValueDtoList: [],
  },
});

export default {
  name: 'error-repair',
  mixins: [selectionMixin],
  props: {
    fdIsValid: String,
    id: String,
  },
  components: {
    SelectTypeLine,
    SelectRuleType,
  },
  computed: {
    rules() {
      return {
        fdRoleCode: [
          {
            required: true,
            message: '请输入角色标识',
            trigger: 'blur',
          },
        ],
        fdConfigTitle: [
          {
            required: true,
            message: '请输入描述字段',
            trigger: 'blur',
          },
        ],
        fdTypeCode: [
          {
            required: true,
            message: '请选择类型标识',
            trigger: 'change',
          },
        ],
        sysRoleConfigValueDtoList: [
          {
            required: true,
            message: '请选择值范围',
            trigger: 'change',
          },
        ],
        fdName: [
          {
            required: true,
            message: '请选择值范围',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        this.$confirm({
          title: this.id ? '确认编辑角色?' : '确认新增角色?',
          onOk: async () => {
            if (!this.id == '') {
              await api.common.putSysRoleConfig({
                fdTypeCode: this.tempValue.fdTypeCode,
                fdTypeName: this.tempValue.fdTypeName,
                fdConfigTitle: this.tempValue.fdConfigTitle,
                fdIsValid: this.fdIsValid,
                fdRoleCode: this.tempValue.fdRoleCode,
                id: this.id,
                sysRoleConfigValueDtoList: this.tempValue.sysRoleConfigValueDtoList,
              });

              this.$message.success('角色修改成功');
              this.onOk();
            } else {
              await api.common.postSysRoleConfig({
                fdTypeCode: this.tempValue.fdTypeCode,
                fdTypeName: this.tempValue.fdTypeName,
                fdConfigTitle: this.tempValue.fdConfigTitle,
                fdRoleCode: this.tempValue.fdRoleCode,
                sysRoleConfigValueDtoList: this.tempValue.sysRoleConfigValueDtoList,
              });

              this.$message.success('角色添加成功');
              this.onOk();
            }
          },
          onCancel: () => {},
        });
      });
    },
    handleFdTypeCode(res) {
      this.tempValue.fdTypeCode = (res[0] || {}).value;
      this.tempValue.fdTypeName = (res[0] || {}).text;
      this.tempValue.sysRoleConfigValueDtoList = [];
    },
    handleFdCode(res) {
      this.tempValue.sysRoleConfigValueDtoList = (res || []).map((d) => ({
        fdCode: d.value,
        fdName: d.text,
      }));
    },
    handleDeptCodeConfirm(list) {
      this.tempValue.sysRoleConfigValueDtoList = (list || []).map((d) => ({
        fdCode: d.code,
        fdName: d.name,
      }));
    },
  },
};
</script>
