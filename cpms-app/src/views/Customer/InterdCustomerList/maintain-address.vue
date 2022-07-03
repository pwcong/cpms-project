<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" title="客户办公地址维护" left-text="关闭" left-arrow @click-left="onCancel" />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <address-list :moduleId="moduleId" v-model="tempValue" @change="handAddressList" />
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, positionMixin } from '@/mixins';
import AMapItem from '@/components/selection-amap/item';
import AddressList from './address-list';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'maintain-address',
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
    AddressList,
  },
  watch: {
    visible(v) {
      if (v) {
        this.handAddressList();
      }
    },
  },
  data() {
    return {
      showAddress: false,
    };
  },
  methods: {
    async handAddressList() {
      const data = await api.customer.getCustomerDetail(this.moduleId);
      this.tempValue = {
        ...data,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
