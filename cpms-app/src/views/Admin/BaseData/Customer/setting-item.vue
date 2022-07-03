<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" title="数据详情" left-text="取消" left-arrow @click-left="onCancel" />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form">
            <block>
              <van-field v-model="tempValue.fdCustomerName" name="tempValue.fdCustomerName" label="客户名称" readonly />
              <van-field
                v-model="tempValue.fdSapCompanyName"
                name="tempValue.fdSapCompanyName"
                label="分公司名称"
                readonly
              />
              <van-field v-model="tempValue.fdSaleName" name="tempValue.fdSaleName" label="销售部名称" readonly />
              <van-field
                v-model="tempValue.fdChannelOneName"
                name="tempValue.fdChannelOneName"
                label="一级渠道"
                readonly
              />
              <van-field
                v-model="tempValue.fdChannelTwoName"
                name="tempValue.fdChannelTwoName"
                label="二级渠道"
                readonly
              />
              <van-field
                v-model="tempValue.fdChannelThreeName"
                name="tempValue.fdChannelThreeName"
                label="三级渠道"
                readonly
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'setting-item',
  mixins: [selectionMixin],
};
</script>
<style lang="scss" scoped></style>
