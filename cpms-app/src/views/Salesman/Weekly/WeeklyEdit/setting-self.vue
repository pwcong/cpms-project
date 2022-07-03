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
          title="个人销售达成设置"
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
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdProductLineName"
                name="tempValue.fdProductLineName"
                label="产品线"
                placeholder="请选择"
                @click="showProductLine = true"
                :rules="[{ required: true, message: `请选择产品线` }]"
              />
              <van-field
                v-model="tempValue.fdRealizedIncome"
                name="tempValue.fdRealizedIncome"
                label="实际收入（万）"
                placeholder="请输入"
                required
                type="number"
                :rules="[{ required: true, message: `请输入实际收入（万）` }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <selection-product-line
      searchable
      title="选择产品线"
      :visible.sync="showProductLine"
      @change="handleSelectProductLine"
      :value="!!tempValue.fdProductLineCode ? [{ value: tempValue.fdProductLineCode }] : []"
    />
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectionProductLine from '@/views/components/selection/product-line';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineName: '',
    fdProductLineCode: '',
    fdRealizedIncome: 0,
  },
});

export default {
  name: 'setting-self',
  mixins: [selectionMixin],
  components: {
    SelectionProductLine,
  },
  data() {
    return {
      showProductLine: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.onOk();
    },
    handleSelectProductLine(res) {
      this.tempValue.fdProductLineName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).value;
    },
  },
};
</script>
<style lang="scss" scoped></style>
