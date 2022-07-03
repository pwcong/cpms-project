<template>
  <p-select
    :class="{
      'select-base': true,
      'read-only': readOnly,
    }"
    show-search
    :allow-clear="allowClear"
    :placeholder="placeholder || ''"
    :value="currentValue"
    :mode="currentMode"
    :filter-option="false"
    @search="query.keyword = $event"
    @change="handleChange"
    :disabled="disabled || readOnly"
    :options="
      (options || list || []).map((d) => ({
        value: d.value,
        label: d.label || d.text,
        disabled: d.disabled,
        key: d.value,
        title: d.label || d.text,
      }))
    "
    labelInValue
  >
    <p-spin v-if="loading" slot="notFoundContent" size="small" />
    <!-- <p-select-option v-for="item in list" :key="item.value" :value="item.value">
      {{ item.text }}
    </p-select-option> -->
  </p-select>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'select-base',
  mixins: [selectionMixin],
  props: {
    placeholder: {
      type: String,
    },
    allowClear: {
      type: Boolean,
    },
    multiple: {
      type: Boolean,
    },
    readOnly: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    options: {
      type: Array,
    },
  },
  computed: {
    currentValue() {
      return this.tempValue.map((d) => ({
        key: d.value,
        label: d.text,
      }));
    },
    currentMode() {
      return !!this.multiple ? 'multiple' : 'default';
    },
  },
  methods: {
    handleChange(v) {
      if (this.readOnly) {
        return;
      }

      const options = (this.options || this.list || [])
        .concat(this.tempValue)
        .reduce((p, c) => {
          p.set(c.value, c);
          return p;
        }, new Map());

      let finalValue = [];

      if (!!v) {
        if (this.multiple) {
          finalValue = v.filter((d) => options.has(d.key)).map((d) => options.get(d.key));
        } else {
          options.has(v.key) && (finalValue = [options.get(v.key)]);
        }
      } else {
        // 清空数据清空筛选查询
      }

      this.query.keyword = '';
      this.tempValue = finalValue;
      this.onOk();
    },
  },
};
</script>

<style lang="scss">
.select-base {
  // &.read-only {
  //   // pointer-events: none;
  // }

  &.read-only.poros-select-disabled {
    color: unset;
  }

  &.read-only.poros-select-disabled .poros-select-selection {
    background-color: unset;
  }

  &.read-only.poros-select-disabled
    .poros-select-selection--multiple
    .poros-select-selection__choice {
    color: unset;
    background-color: unset;
  }
}
</style>
