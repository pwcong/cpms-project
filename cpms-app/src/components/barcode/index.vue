<template>
  <div class="barcode">
    <div class="barcode-wrapper" v-show="!!value">
      <canvas ref="barcode" :data-clipboard-text="value"></canvas>
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
        width: 1,
        height: 20,
        fontSize: 14,
        margin: 2,
      }),
    },
  },
  data() {
    return {
      clipboard: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.initBarcode(v);
      },
    },
  },
  methods: {
    initBarcode(v) {
      if (!!v) {
        JsBarcode(this.$refs.barcode, v, this.options);

        if (this.clipboard) {
          this.clipboard.destroy();
          this.clipboard = null;
        }
        const clipboard = (this.clipboard = new ClipboardJS(this.$refs.barcode));
        clipboard.on('success', (e) => {
          this.$toast.success({
            message: `${this.title}复制成功`,
          });
          e.clearSelection();
        });
        this.$once('hook:beforeDestroy', () => {
          clipboard.destroy();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.barcode {
  display: inline-block;

  &-wrapper {
    display: flex;
    align-items: center;
  }

  div {
    white-space: nowrap;
    margin-right: 8px;
    color: #999999;
    font-size: 12px;
    span {
      font-size: 14px;
      color: #040c2c;
    }
  }
}
</style>
