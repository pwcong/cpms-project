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
      <p-form-model-item label="客户办公地点" prop="fdDetailaddress">
        <div style="display: flex">
          <p-input
            style="flex: 1"
            :value="tempValue.fdDetailaddress"
            placeholder="请选择"
          >
          </p-input>
          <p-button-link style="margin-left: 8px" @click="showMap = true">
            设置
          </p-button-link>
        </div>
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>

    <selection-amap :visible.sync="showMap" @change="handleSelectAddress" />
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdDetailaddress: '',
  },
});

export default {
  name: 'setting-address',
  mixins: [selectionMixin],
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}客户地址`;
    },
  },
  data() {
    return {
      showMap: false,
      rules: {
        fdDetailaddress: [
          {
            required: true,
            message: '请选择客户办公地点',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    handleSelectAddress(res) {
      res = res[0];
      if (!res) {
        return;
      }

      const { data = {}, text, value } = res;

      const {
        province = '',
        city = '',
        district = '',
        township = '',
        adcode,
      } = data.addressComponent || {};
      this.tempValue.fdProvince = typeof province === 'string' ? province : '';
      this.tempValue.fdCity = typeof city === 'string' ? city : '';
      this.tempValue.fdCounty = typeof district === 'string' ? district : '';
      this.tempValue.fdStreet = typeof township === 'string' ? township : '';
      this.tempValue.fdDetailaddress = text;
      this.tempValue.fdLongitude = Number(value.split(',')[0]);
      this.tempValue.fdLatitude = Number(value.split(',')[1]);
      this.tempValue.fdAdcode = adcode;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.onOk();
      });
    },
  },
};
</script>
