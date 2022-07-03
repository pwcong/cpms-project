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
          title="销售任务达成设置"
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
                v-model="tempValue.fdMonth"
                name="tempValue.fdMonth"
                label="月份"
                type="number"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入月份` }]"
              />

              <van-field
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdBusinessCenterName"
                name="tempValue.fdBusinessCenterName"
                label="商务中心"
                placeholder="请选择"
                @click="showBusiness = true"
                :rules="[{ required: true, message: `请选择商务中心` }]"
              />

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
                v-model="tempValue.fdSalesTask"
                name="tempValue.fdSalesTask"
                label="销售任务（万）"
                placeholder="请输入"
                type="number"
                required
                :rules="[{ required: true, message: `请输入销售任务（万）` }]"
              />

              <van-field
                v-model="tempValue.fdRealizedIncome"
                name="tempValue.fdRealizedIncome"
                label="实际收入（万）"
                placeholder="请输入"
                type="number"
                required
                :rules="[{ required: true, message: `请输入实际收入（万）` }]"
              />

              <van-field name="tempValue.fdPercentageComplete" label="完成率" :value="`${fdPercentageComplete}%`" />
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
    <selection-business
      searchable
      title="选择商务中心"
      :visible.sync="showBusiness"
      @change="handleSelectBusiness"
      :value="!!tempValue.fdBusinessCenterCode ? [{ value: tempValue.fdBusinessCenterCode }] : []"
    />
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionBusiness from '@/views/components/selection/business';
import dayjs from 'dayjs';
const currMonth = dayjs().month() + 1;

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdMonth: currMonth,
    fdBusinessCenterName: '',
    fdBusinessCenterCode: '',
    fdProductLineName: '',
    fdProductLineCode: '',
    fdSalesTask: 0,
    fdRealizedIncome: 0,
  },
});

export default {
  name: 'setting-sales',
  mixins: [selectionMixin],
  components: {
    SelectionProductLine,
    SelectionBusiness,
  },
  data() {
    return {
      showProductLine: false,
      showBusiness: false,
    };
  },
  computed: {
    fdPercentageComplete() {
      const { fdSalesTask = 0, fdRealizedIncome = 0 } = this.tempValue;

      return Number(((Number(fdRealizedIncome) / (Number(fdSalesTask) || 1)) * 100).toFixed(2));
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.tempValue = {
        ...this.tempValue,
        fdPercentageComplete: this.fdPercentageComplete,
      };
      this.onOk();
    },
    handleSelectProductLine(res) {
      this.tempValue.fdProductLineName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).value;
    },
    handleSelectBusiness(res) {
      this.tempValue.fdBusinessCenterName = (res[0] || {}).text;
      this.tempValue.fdBusinessCenterCode = (res[0] || {}).value;
    },
  },
};
</script>
<style lang="scss" scoped></style>
