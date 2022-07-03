<template>
  <p-modal
    :maskClosable="false"
    title="客户地址维护"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <!-- 客户办公地址 -->
    <address-list :moduleId="moduleId" v-model="tempValue" />
    <span slot="footer">
      <span>
        <p-button @click="onCancel">关 闭</p-button>
      </span>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import AddressList from './address-list.vue';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'maintain-address',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  watch: {
    visible(v) {
      if (v) {
        this.handAddressList();
      }
    },
  },
  components: {
    AddressList,
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
