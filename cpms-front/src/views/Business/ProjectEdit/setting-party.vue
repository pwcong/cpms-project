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
      <p-form-model-item label="人员归属" prop="fdPersonnelAttribution">
        <select-personnel-attribution
          :disabled="!allowEdit"
          :value="
            !!tempValue.fdPersonnelAttribution
              ? [
                  {
                    value: tempValue.fdPersonnelAttribution,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="tempValue.fdPersonnelAttribution = ($event[0] || {}).value"
        />
      </p-form-model-item>
      <p-form-model-item label="姓名" prop="fdName">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.fdName"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="电话" prop="fdMobile">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.fdMobile"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="职务" prop="fdPosition">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.fdPosition"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="上级领导" prop="fdSuperiors">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.fdSuperiors"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="参与角色" prop="fdRole">
        <select-role
          :value="
            (tempValue.fdRole || '')
              .split(',')
              .filter((v) => !!v)
              .map((v) => ({
                value: v,
              }))
          "
          allow-clear
          placeholder="请选择"
          multiple
          @change="tempValue.fdRole = $event.map((d) => d.value).join(',')"
        />
      </p-form-model-item>
      <p-form-model-item label="立场" prop="fdStandpoint">
        <select-stand-point
          :value="
            !!tempValue.fdStandpoint
              ? [
                  {
                    value: tempValue.fdStandpoint,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="tempValue.fdStandpoint = ($event[0] || {}).value"
        />
      </p-form-model-item>
      <p-form-model-item label="接触状态" prop="fdContactStatus">
        <select-contact-status
          :value="
            !!tempValue.fdContactStatus
              ? [
                  {
                    value: tempValue.fdContactStatus,
                  },
                ]
              : []
          "
          placeholder="请选择"
          allow-clear
          @change="tempValue.fdContactStatus = ($event[0] || {}).value"
        />
      </p-form-model-item>
      <p-form-model-item label="客情关系" prop="fdGuestRelationship">
        <select-guest-relationship
          :value="
            !!tempValue.fdGuestRelationship
              ? [
                  {
                    value: tempValue.fdGuestRelationship,
                  },
                ]
              : []
          "
          placeholder="请选择"
          allow-clear
          @change="tempValue.fdGuestRelationship = ($event[0] || {}).value"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <!-- <p-button @click="onCancel">取消</p-button>
      <template v-if="mode === 'add'">
        <p-button type="primary" @click="handleSubmit(false)">
          保存并新增
        </p-button>
        <p-button type="primary" @click="handleSubmit(true)">新增</p-button>
      </template>
      <template v-if="mode === 'edit'">
        <p-button type="primary" @click="handleSubmit(true)">保存</p-button>
      </template> -->
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit(true)">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

import SelectPersonnelAttribution from '../components/select/personnel-attribution';
import SelectRole from '../components/select/role';
import SelectGuestRelationship from '../components/select/guest-relationship';
import SelectContactStatus from '../components/select/contact-status';
import SelectStandPoint from '../components/select/stand-point';

const defaultValue = {
  fdPersonnelAttribution: '',
  fdName: '',
  fdMobile: '',
  fdPosition: '',
  fdSuperiors: '',
  fdRole: '',
  fdStandpoint: '',
  fdContactStatus: '',
  fdGuestRelationship: '',
  fdIsValid: '',
};

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
});

export default {
  name: 'setting-party',
  mixins: [selectionMixin],
  components: {
    SelectPersonnelAttribution,
    SelectRole,
    SelectGuestRelationship,
    SelectContactStatus,
    SelectStandPoint,
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}项目干系人`;
    },
    rules() {
      const {} = this.tempValue;

      return {
        fdPersonnelAttribution: [
          {
            required: true,
            message: '请选择人员归属',
            trigger: 'change',
          },
        ],
        fdName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        fdMobile: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur',
          },
        ],
        fdPosition: [
          {
            required: true,
            message: '请输入职务',
            trigger: 'blur',
          },
        ],
      };
    },
    allowEdit() {
      return !this.tempValue.id;
    },
  },
  data() {
    return {};
  },
  methods: {
    handleSubmit(done) {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        // 若ID存在数据变更需请求接口
        // if (!!this.moduleId) {
        //   try {
        //     if (this.isEdit) {
        //       await api.business.putProjectStakeholderForm(this.tempValue);
        //     } else {
        //       const data = await api.business.postProjectStakeholderForm({
        //         ...this.tempValue,
        //         fdMainId: this.moduleId,
        //       });

        //       this.tempValue = {
        //         ...this.tempValue,
        //         id: data.id,
        //       };
        //     }

        //     this.onOk();
        //   } catch (e) {
        //     console.error(e);
        //   }
        // } else {
        //   this.onOk();
        // }

        if (done) {
          this.onOk();
        } else {
          this.onOk(false);
          this.tempValue = {
            ...defaultValue,
          };
        }
      });
    },
  },
};
</script>
