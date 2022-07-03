<template>
  <div>
    <van-action-sheet
      :value="tempVisible"
      :actions="tempValue"
      @select="handleSelect"
      cancel-text="取消"
      @cancel="tempVisible = false"
      :close-on-click-overlay="false"
      :get-container="selectionContainer"
    />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'debug',
  mixins: [selectionMixin],
  props: {
    onSelect: {
      type: Function,
      default: function () {
        // DO NOTHING
      },
    },
  },
  data() {
    return {
      tempVisible: false,
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.tempVisible = v;
      },
    },
  },
  methods: {
    handleSelect(item) {
      this.onSelect(item);
      this.tempVisible = false;
    },
  },
};
</script>
