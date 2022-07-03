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
      <p-form-model-item label="拜访类型" prop="fdVisitType">
        <select-dict
          :value="
            !!tempValue.fdVisitType
              ? [
                  {
                    value: tempValue.fdVisitType,
                  },
                ]
              : []
          "
          dictCode="cpms_visit_type"
          systemCode="cpms"
          placeholder="请选择"
          allow-clear
          @change="handleChangeVisitType"
        />
      </p-form-model-item>

      <p-form-model-item
        v-if="!!tempValue.fdVisitType"
        :label="`${moduleName}名称`"
        prop="fdModuleType"
      >
        <select-project
          status="todo,audit,follow,done"
          placeholder="请选择"
          v-if="tempValue.fdVisitType === 'project'"
          :value="
            !!tempValue.fdModuleTypeId
              ? [
                  {
                    text: tempValue.fdModuleType,
                    value: tempValue.fdModuleTypeId,
                  },
                ]
              : []
          "
          @change="handleChangeModule"
        />
        <select-clue
          queryType="followBy"
          placeholder="请选择"
          v-if="tempValue.fdVisitType === 'clue'"
          :value="
            !!tempValue.fdModuleTypeId
              ? [
                  {
                    text: tempValue.fdModuleType,
                    value: tempValue.fdModuleTypeId,
                  },
                ]
              : []
          "
          @change="handleChangeModule"
        />
        <select-customer
          status="todo,audit,pass"
          placeholder="请选择"
          v-if="tempValue.fdVisitType === 'cust'"
          :value="
            !!tempValue.fdModuleTypeId
              ? [
                  {
                    text: tempValue.fdModuleType,
                    value: tempValue.fdModuleTypeId,
                  },
                ]
              : []
          "
          @change="handleChangeModule"
        />
      </p-form-model-item>

      <p-form-model-item
        v-if="!!tempValue.fdVisitType"
        label="拜访方式"
        prop="fdVisitWay"
      >
        <select-dict
          :value="
            !!tempValue.fdVisitWay
              ? [
                  {
                    value: tempValue.fdVisitWay,
                  },
                ]
              : []
          "
          dictCode="cpms_visit_way"
          systemCode="cpms"
          placeholder="请选择"
          allow-clear
          @change="handleChangeVisitWay"
        />
      </p-form-model-item>

      <p-form-model-item
        v-if="!!tempValue.fdVisitWay"
        label="拜访地址"
        prop="fdVisitAddress"
      >
        <p-select
          v-if="tempValue.fdVisitWay === 'address'"
          :value="
            !!tempValue.fdVisitAddressId
              ? [
                  {
                    key: tempValue.fdVisitAddressId,
                    label: tempValue.fdVisitAddress,
                  },
                ]
              : []
          "
          @change="handleChangeAddress"
          placeholder="请选择"
          labelInValue
        >
          <p-select-option v-for="item in address" :key="item.value" :value="item.value">
            {{ item.text }}
          </p-select-option>
        </p-select>

        <select-clock-in-address
          v-if="tempValue.fdVisitWay === 'customerVisit'"
          :value="
            !!tempValue.fdVisitAddressId
              ? [
                  {
                    value: tempValue.fdVisitAddressId,
                    text: tempValue.fdVisitAddress,
                  },
                ]
              : []
          "
          placeholder="请选择"
          @change="handleChangeAddress($event[0])"
        />
      </p-form-model-item>

      <p-form-model-item label="拜访人姓名" prop="fdVisitName">
        <p-input v-model="tempValue.fdVisitName" placeholder="请输入" :maxLength="200" />
      </p-form-model-item>
      <p-form-model-item label="拜访人职务" prop="fdVisitJob">
        <p-input v-model="tempValue.fdVisitJob" placeholder="请输入" />
      </p-form-model-item>
      <p-form-model-item label="拜访人电话" prop="fdVisitMobile">
        <p-input v-model="tempValue.fdVisitMobile" placeholder="请输入" />
      </p-form-model-item>
      <p-form-model-item label="拜访目的" prop="fdVisitPurpose">
        <p-input v-model="tempValue.fdVisitPurpose" placeholder="请输入" />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import formMixin from './form';

import api from '@/api';
import SelectProject from '@/views/components/select/project';
import SelectClue from '@/views/components/select/clue';
import SelectCustomer from '@/views/components/select/customer';
import SelectClockInAddress from '@/views/Salesman/components/select/clockin-address';

export function getModuleName(visitType) {
  switch (true) {
    case visitType === 'clue':
      return '线索';
    case visitType === 'cust':
      return '客户';
    case visitType === 'project':
      return '项目';
    default:
      return '模块';
  }
}

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdVisitType: '',
    fdModuleTypeId: '',
    fdModuleType: '',
    fdVisitWay: '',
    fdVisitAddress: '',
    fdVisitAddressId: '',
  },
});

export default {
  name: 'setting-visit',
  mixins: [selectionMixin, formMixin],
  components: {
    SelectProject,
    SelectClue,
    SelectCustomer,
    SelectClockInAddress,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}拜访计划`;
    },
    moduleName() {
      return getModuleName(this.tempValue.fdVisitType);
    },
    rules() {
      return {
        fdVisitType: [
          {
            required: true,
            message: '请选择拜访类型',
            trigger: 'change',
          },
        ],
        fdModuleType: [
          {
            required: true,
            message: `请选择${getModuleName(this.tempValue.fdVisitType)}名称`,
            trigger: 'change',
          },
        ],
        fdVisitWay: [
          {
            required: true,
            message: '请选择拜访方式',
            trigger: 'change',
          },
        ],
        fdVisitAddress: [
          {
            required: true,
            message: '请选择办公地址',
            trigger: 'change',
          },
        ],
        fdVisitName: [
          {
            required: true,
            message: '请输入拜访人姓名',
            trigger: 'blur',
          },
        ],
        fdVisitMobile: [
          {
            required: true,
            message: '请输入拜访人电话',
            trigger: 'blur',
          },
        ],
        fdVisitPurpose: [
          {
            required: true,
            message: '请输入拜访目的',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  data() {
    return {
      address: [],
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.onOk();
      });
    },
    handleChangeVisitType(res) {
      this.tempValue.fdVisitType = (res[0] || {}).value;
      this.tempValue.fdModuleTypeId = '';
      this.tempValue.fdModuleType = '';
      this.tempValue.fdVisitAddress = '';
      this.tempValue.fdVisitAddressId = '';
    },
    handleChangeAddress(value) {
      this.tempValue.fdVisitAddressId = value.key || value.value;
      this.tempValue.fdVisitAddress = value.label || value.text;
    },
    handleChangeVisitWay(res) {
      this.tempValue.fdVisitWay = (res[0] || {}).value;
      this.tempValue.fdVisitAddress = '';
      this.tempValue.fdVisitAddressId = '';
    },
    handleChangeModule(res) {
      const value = res[0];
      this.tempValue.fdModuleType = value.text;
      this.tempValue.fdModuleTypeId = value.value;
      //访客来访方式不清空
      if (this.tempValue.fdVisitWay !== 'customerVisit') {
        this.tempValue.fdVisitAddress = '';
        this.tempValue.fdVisitAddressId = '';
      }
      this.loadAddress(value.value);
    },
    async loadAddress(id) {
      const { fdVisitType } = this.tempValue;

      if (fdVisitType === 'clue') {
        const data = await api.clue.getClueDetail(id);
        console.log(data);
        this.address = (data.addressList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'project') {
        const data = await api.business.getProjectDetail(id);
        console.log(data);
        this.address = (data.addressListDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailAddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'cust') {
        const data = await api.customer.getCustomerDetail(id);
        console.log(data);
        this.address = (data.addressDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      }
    },
  },
};
</script>
