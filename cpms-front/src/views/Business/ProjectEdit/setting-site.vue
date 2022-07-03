<template>
  <p-modal
    :maskClosable="false"
    title="所在地设置"
    :visible="visible"
    width="400px"
    @cancel="onCancel"
  >
    <p-form-model ref="form" :model="tempValue" :rules="rules">
      <!-- <p-form-model-item label="是否主所在地" prop="fdIsMain">
        <select-yes-or-no
          :value="!!tempValue.fdIsMain ? [{ value: tempValue.fdIsMain }] : []"
          placeholder="请选择"
          @change="handleChangeMain"
        />
      </p-form-model-item> -->
      <p-form-model-item
        v-if="tempValue.fdIsMain !== '1'"
        label="是否全国"
        prop="fdEntireCountry"
      >
        <select-yes-or-no
          :value="
            !!tempValue.fdEntireCountry ? [{ value: tempValue.fdEntireCountry }] : []
          "
          placeholder="请选择"
          @change="tempValue.fdEntireCountry = $event[0].value"
        />
      </p-form-model-item>
      <template v-if="tempValue.fdEntireCountry !== '1'">
        <p-form-model-item label="所在省" prop="fdProvince">
          <select-province
            :value="
              !!tempValue.fdProvince
                ? [
                    {
                      value: tempValue.fdProvince,
                      text: tempValue.fdProvinceName,
                    },
                  ]
                : []
            "
            placeholder="请选择"
            allow-clear
            @change="handleChangeProvince"
          />
        </p-form-model-item>
        <p-form-model-item label="所在市" prop="fdCity">
          <select-city
            :provinceCode="tempValue.fdProvince"
            :value="
              !!tempValue.fdCity
                ? [{ value: tempValue.fdCity, text: tempValue.fdCityName }]
                : []
            "
            placeholder="请选择"
            allow-clear
            @change="handleChangeCity"
          />
        </p-form-model-item>
      </template>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit" :loading="loading">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdIsMain: '',
    fdEntireCountry: '',
    fdProvince: '',
    fdProvinceName: '',
    fdCity: '',
    fdCityName: '',
    fdBusinessName: '',
    fdBusinessCode: '',
    fdIsRegion: '',
    fdRegionNum: 0,
    fdRegionBusinessCode: '',
  },
});

export default {
  name: 'setting-site',
  mixins: [selectionMixin],
  components: {
    SelectProvince,
    SelectCity,
    SelectYesOrNo,
  },
  data() {
    return {
      loading: false,
    };
  },
  props: {
    settingData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    rules() {
      const { fdEntireCountry, fdIsMain } = this.tempValue;

      return {
        fdProvince: [
          {
            required: fdEntireCountry !== '1' || fdIsMain === '1',
            message: '请选择所在省',
            trigger: 'change',
          },
        ],
        fdCity: [
          {
            required: fdIsMain === '1',
            message: '请选择所在市',
            trigger: 'change',
          },
        ],
      };
    },
  },
  methods: {
    handleChangeProvince(res) {
      this.tempValue.fdProvince = (res[0] || {}).value;
      this.tempValue.fdProvinceName = (res[0] || {}).text;
      this.tempValue.fdCity = '';
      this.tempValue.fdCityName = '';
    },
    handleChangeCity(res) {
      this.tempValue.fdCity = (res[0] || {}).value;
      this.tempValue.fdCityName = (res[0] || {}).text;
    },
    handleChangeMain(res) {
      this.tempValue.fdEntireCountry = '0';
      this.tempValue.fdIsMain = res[0].value;
    },
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        this.loading = true;

        try {
          const data = await api.business.postProjectIsRegion(this.tempValue);

          this.tempValue = {
            ...this.tempValue,
            fdIsRegion: data.fdIsRegion,
            fdBusinessName: data.fdBusinessName,
            fdBusinessCode: data.fdBusinessCode,
            fdRegionNum: data.fdRegionNum,
            fdRegionBusinessCode: data.fdRegionBusinessCode,
          };

          this.onOk();
        } finally {
          this.loading = false;
        }
      });
    },
  },
};
</script>
