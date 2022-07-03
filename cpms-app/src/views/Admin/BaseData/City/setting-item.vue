<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" title="市级数据详情" left-text="取消" left-arrow @click-left="onCancel" />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form">
            <block>
              <van-field v-model="tempValue.fdCityName" name="tempValue.fdCityName" label="市级名称" readonly />
              <van-field v-model="tempValue.fdCityCode" name="tempValue.fdCityCode" label="Code" readonly />
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
