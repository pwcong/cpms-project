<template>
  <van-popup
    class="treeselect-area"
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout class="treeselect-area-wrapper">
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" :title="title" left-text="取消" left-arrow @click-left="onCancel">
          <template #right>
            <div style="color: white">
              <span @click="tempValue = []" v-if="!!tempValue.length" style="margin-right: 10px"> 清空 </span>
              <span @click="onOk">
                {{ `确定${!!tempValue.length ? `(${tempValue.length})` : ''}` }}
              </span>
            </div>
          </template>
        </van-nav-bar>
      </template>

      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 90px)">
          <van-tree-select
            :items="data"
            :active-id="activeId"
            @click-item="handleChange"
            :main-active-index.sync="activeIndex"
            height="100%"
          />
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

import data from './data';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'treeselect-area',
  mixins: [selectionMixin],
  props: {
    title: {
      type: String,
      default: '选择',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeIndex: 0,
      data: data.map((d) => ({
        ...d,
        children: [
          {
            ...d,
            id: d.value,
            text: d.value === '100000' ? d.text : '全省/市/区',
            _text: d.text,
          },
        ].concat(
          d.children.map((_d) => ({
            ..._d,
            id: _d.value,
          }))
        ),
      })),
    };
  },

  computed: {
    activeId() {
      return this.tempValue.map((d) => d.value);
    },
  },

  methods: {
    handleChange(item) {
      let finalValue = [];
      if (this.isChecked(item)) {
        finalValue = this.tempValue.filter((d) => d.value !== item.value);
      } else {
        if (!this.multiple) {
          finalValue = [item];
        } else {
          if (item.value === '100000') {
            finalValue = [item];
          } else if (item.value.slice(2) === '0000') {
            finalValue = this.tempValue
              .filter((d) => d.value !== '100000')
              .filter((d) => d.value.slice(0, 2) !== item.value.slice(0, 2))
              .concat([item]);
          } else {
            finalValue = this.tempValue
              .filter((d) => d.value !== '100000')
              .filter((d) => d.value !== `${item.value.slice(0, 2)}0000`)
              .concat([item]);
          }
        }
      }

      this.tempValue = finalValue.map((d) => ({
        ...d,
        text: d._text || d.text,
      }));
    },
    isChecked(item) {
      return this.tempValue.findIndex((d) => d.value === item.value) > -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.treeselect-area {
}
</style>
