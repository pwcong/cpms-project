<template>
  <p-modal
    :maskClosable="false"
    :title="title"
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
      <p-form-model-item label="姓名" prop="fdContactName">
        <p-input
          v-model="tempValue.fdContactName"
          :readOnly="!!isEdit && !!moduleId && status !== 'draft'"
          placeholder="请输入"
          :maxLenth="200"
        />
      </p-form-model-item>
      <p-form-model-item label="职务" prop="fdContactPost">
        <p-input
          v-model="tempValue.fdContactPost"
          :readOnly="!!isEdit && !!moduleId && status !== 'draft'"
          placeholder="请输入"
          :maxLenth="200"
        />
      </p-form-model-item>
      <p-form-model-item label="手机号" prop="fdContactMobile">
        <p-input
          v-model="tempValue.fdContactMobile"
          placeholder="请输入"
          :readOnly="!!isEdit && !!moduleId && status !== 'draft'"
          :maxLenth="200"
        />
      </p-form-model-item>
      <p-form-model-item label="座机" prop="fdContactPhone">
        <p-input
          v-model="tempValue.fdContactPhone"
          placeholder="请输入"
          :readOnly="!!isEdit && !!moduleId && status !== 'draft'"
          :maxLenth="200"
        />
      </p-form-model-item>
      <p-form-model-item label="上级">
        <p-select
          allowClear
          placeholder="请选择"
          v-model="tempValue.fdContactLeaderName"
          @change="handleChange"
        >
          <p-select-option
            v-for="item in contactAddParamList"
            :value="item"
            :key="item.fdContactLeaderId"
          >
            {{ item.fdContactLeaderName }}
          </p-select-option>
        </p-select>
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
import { buildSelectionMixin, userMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdContactName: '',
    fdContactPost: '',
    fdContactMobile: '',
    fdContactPhone: '',
    fdContactLeaderName: [],
  },
});

export default {
  name: 'setting-contact',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: {
      type: String,
    },
    contactAddParamList: {
      type: Array,
    },
    status: {
      type: String,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}客户联系人`;
    },
    rules() {
      const { fdContactMobile, fdContactPhone } = this.tempValue;
      const t = !fdContactMobile && !fdContactPhone;
      return {
        fdContactName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        fdContactPost: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        fdContactMobile: [
          { required: t, message: '手机号或座机必填一个', trigger: 'blur' },
        ],
        fdContactPhone: [
          { required: t, message: '手机号或座机必填一个', trigger: 'blur' },
        ],
      };
    },
  },
  methods: {
    handleChange(value, key) {
      this.tempValue = {
        ...this.tempValue,
        fdContactLeaderName: (value || {}).fdContactLeaderName,
        fdContactLeaderId: (key || {}).key,
      };
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }
        if (this.tempValue.fdContactLeaderName.length === 0) {
          this.tempValue.fdContactLeaderName = '';
        }
        if (!!this.moduleId && this.status !== 'draft') {
          try {
            if (this.isEdit) {
              const query = {
                fdContactLeaderId: this.tempValue.fdContactLeaderId,
                fdContactLeaderName: this.tempValue.fdContactLeaderName,
                version: this.tempValue.version,
                id: this.tempValue.id,
              };
              await api.customer.putCustomerContactholderEdit(query);
            } else {
              const custContactAddParamList = [];
              const contactAddParamList = {
                ...this.tempValue,
                fdMainId: this.moduleId,
              };
              custContactAddParamList.push(contactAddParamList);
              const data = await api.customer.postAddCustomerContact(
                custContactAddParamList
              );
              this.tempValue = {
                ...data[0],
                createByName: this.user.name,
              };
            }

            this.onOk();
          } catch (e) {
            console.error(e);
          }
        } else {
          this.onOk();
        }
      });
    },
  },
};
</script>
