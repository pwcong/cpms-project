<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar
          :class="className"
          title="客户办公地址设置"
          left-text="取消"
          left-arrow
          right-text="保存"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                v-model="tempValue.fdDetailaddress"
                name="fdDetailaddress"
                label="办公地址"
                placeholder="请输入"
                is-link
                clickable
                readonly
                @click="showAddress = true"
                :rules="[{ required: true, message: '请选择地址' }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
    <selection-amap
      title="选择地址"
      :position="position"
      searchable
      @relocation="getPosition"
      :visible.sync="showAddress"
      @change="handleSelectAddress"
    >
      <template v-slot:item="{ value, checked }">
        <amap-item :position="position" :value="value" :checked="checked" />
      </template>
    </selection-amap>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, positionMixin } from '@/mixins';
import AMapItem from '@/components/selection-amap/item';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'setting-address',
  mixins: [selectionMixin, positionMixin],
  props: {
    moduleId: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  components: {
    'amap-item': AMapItem,
  },
  data() {
    return {
      showAddress: false,
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      this.loading = true;
      if (!!this.moduleId && this.status !== 'draft') {
        try {
          const officeAddresAddParam = [];
          const officeAddresAddParamList = {
            ...this.tempValue,
            fdMainId: this.moduleId,
          };
          officeAddresAddParam.push(officeAddresAddParamList);
          const data = await api.customer.postAddCustomerOfficeAddres(officeAddresAddParam);
        } catch (e) {
          console.error(e);
        } finally {
          this.loading = false;
          this.onOk();
        }
      } else {
        this.onOk();
      }
    },
    async handleSelectAddress(v) {
      v = v[0] || {};

      const {
        text = '',
        value = '',
        provinceName = '',
        cityname = '',
        districtName = '',
        districtId = '',
        streetName = '',
      } = v;
      const t = value.split(',').filter((d) => !!d);

      this.tempValue = {
        ...this.tempValue,
        fdDetailaddress: text,
        fdProvince: provinceName,
        fdCity: cityname,
        fdLongitude: t[0],
        fdLatitude: t[1],
        fdAdcode: districtId,
        fdCounty: districtName,
        fdStreet: streetName,
      };
    },
  },
};
</script>
<style lang="scss" scoped></style>
