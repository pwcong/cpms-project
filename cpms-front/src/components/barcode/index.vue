<template>
  <div class="barcode">
    <div class="barcode-wrapper" v-show="!!value">
      <canvas ref="barcode"></canvas>
      <div>
        {{ title }}：
        <p-tooltip placement="bottom">
          <template slot="title">
            <span>鼠标双击复制</span>
          </template>
          <span ref="value" :data-clipboard-text="value">
            {{ value }}
          </span>
        </p-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode';
import ClipboardJS from 'clipboard';

export default {
  name: 'barcode',
  props: {
    value: {
      type: String,
    },
    title: {
      type: String,
      default: '单据编号',
    },
    options: {
      type: Object,
      default: () => ({
        width: 1.1,
        height: 18,
        fontSize: 14,
        margin: 2,
        displayValue: false,
      }),
    },
  },
  watch: {
    value() {
      this.initBarcode();
    },
  },
  mounted() {
    this.initBarcode();
  },
  methods: {
    initBarcode() {
      if (this.value) {
        new ClipboardJS(this.$refs.value);
        JsBarcode(this.$refs.barcode, this.value, this.options);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.barcode {
  display: inline-block;

  &-wrapper {
    // display: flex;
    align-items: center;
  }

  div {
    white-space: nowrap;
    color: rgba(4, 12, 44, 0.65);
    font-size: 12px;
    span {
      font-size: 14px;
      color: #040c2c;
    }
  }
}
</style>
