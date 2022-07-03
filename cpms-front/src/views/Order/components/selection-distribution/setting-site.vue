<template>
  <p-modal
    :maskClosable="false"
    title="新增收货地址"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <p-form-model-item label="姓名" prop="contacts">
        <p-input v-model="tempValue.contacts" placeholder="请输入" :maxLenth="200" />
      </p-form-model-item>
      <p-form-model-item label="电话" prop="contactsPhone">
        <p-input v-model="tempValue.contactsPhone" placeholder="请输入" :maxLenth="200" />
      </p-form-model-item>
      <p-form-model-item label="身份证号" prop="identityCard">
        <p-input v-model="tempValue.identityCard" placeholder="请输入" :maxLenth="200" />
      </p-form-model-item>

      <p-form-model-item label="配送区域" prop="districtCode">
        <div style="display: flex">
          <select-province
            style="flex: 1"
            placeholder="请选择省"
            allow-clear
            :value="
              !!tempValue.provinceName
                ? [
                    {
                      value: tempValue.provinceCode,
                      text: tempValue.provinceName,
                    },
                  ]
                : []
            "
            @change="handleProvince"
          />
          <select-city
            style="flex: 1; margin-left: 4px"
            :province-code="tempValue.provinceCode"
            placeholder="请选择市"
            allow-clear
            :value="
              !!tempValue.cityCode
                ? [
                    {
                      value: tempValue.cityCode,
                      text: tempValue.cityName,
                    },
                  ]
                : []
            "
            @change="handleCity"
          />
          <select-county
            style="flex: 1; margin-left: 4px"
            :city-code="tempValue.cityCode"
            placeholder="请选择区/县"
            allow-clear
            :value="
              !!tempValue.districtCode
                ? [
                    {
                      value: tempValue.districtCode,
                      text: tempValue.districtName,
                    },
                  ]
                : []
            "
            @change="handleCounty"
          />
        </div>
      </p-form-model-item>

      <p-form-model-item label="详细地址" prop="detailAddress">
        <p-input v-model="tempValue.detailAddress" placeholder="请输入" :maxLenth="200" />
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
import SelectProvince from '../select/province';
import SelectCity from '../select/city';
import SelectCounty from '../select/county';
import { buildSelectionMixin, userMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressCode: '',
    contacts: '',
    contactsPhone: '',
    identityCard: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    districtCode: '',
    districtName: '',
    detailAddress: '',
  },
});

export default {
  name: 'setting-site',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: {
      type: String,
    },
    crmCode: {
      type: String,
    },
    needIdentityCard: {
      type: Boolean,
    },
  },

  computed: {
    rules() {
      return {
        contacts: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        contactsPhone: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur',
          },
        ],
        identityCard: [
          {
            required: this.needIdentityCard,
            message: '请输入身份证号',
            trigger: 'blur',
          },
        ],
        districtCode: [
          {
            required: true,
            message: '请选择配送区域',
            trigger: 'change',
          },
        ],
        detailAddress: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  components: {
    SelectProvince,
    SelectCity,
    SelectCounty,
  },
  methods: {
    // 省
    handleProvince(value) {
      this.tempValue.provinceCode = (value[0] || {}).value;
      this.tempValue.provinceName = (value[0] || {}).text;
      this.tempValue.cityCode = '';
      this.tempValue.cityName = '';
      this.tempValue.districtCode = '';
      this.tempValue.districtName = '';
    },
    // 市
    handleCity(value) {
      this.tempValue.cityCode = (value[0] || {}).value;
      this.tempValue.cityName = (value[0] || {}).text;
      this.tempValue.districtCode = '';
      this.tempValue.districtName = '';
    },
    // 区/县
    handleCounty(value) {
      this.tempValue.districtCode = (value[0] || {}).value;
      this.tempValue.districtName = (value[0] || {}).text;
    },
    async handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        await api.order
          .postAddCreAdress({
            ...this.tempValue,
            crmInfoId: this.crmCode,
            isDefault: 'N',
          })
          .then((data) => {
            this.tempValue = { ...data };
          });

        this.onOk();
      });
    },
  },
};
</script>
