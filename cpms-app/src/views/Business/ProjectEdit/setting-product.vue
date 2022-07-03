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
          title="产品设置"
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
                v-model="tempValue.fdProductLineName"
                name="fdProductLineName"
                label="产品线"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showProductLine = true"
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择产品线',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdProductCategoryName"
                name="fdProductCategoryName"
                label="产品类型"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showProductCate = true"
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择产品类型',
                  },
                ]"
              />

              <template>
                <van-field
                  v-if="tempValue.fdProductCategoryCode === '完全定制化'"
                  v-model="tempValue.fdProductName"
                  name="fdProductName"
                  label="产品型号"
                  placeholder="请输入"
                />
                <van-field
                  v-else
                  v-model="tempValue.fdProductName"
                  name="fdProductName"
                  label="产品型号"
                  placeholder="请选择"
                  is-link
                  clickable
                  readonly
                  @click="showProduct = true"
                  required
                  :rules="[
                    {
                      required: true,
                      message: '请选择产品型号',
                    },
                  ]"
                />
              </template>

              <van-field :value="tempValue.fdProductId" readonly label="产品编码" />

              <van-field
                v-model="tempValue.fdNum"
                name="fdNum"
                label="数量"
                placeholder="请输入"
                type="number"
                @change="calcTotalCum"
                required
                :rules="[
                  {
                    required: true,
                    message: '请输入数量',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdPrice"
                name="fdPrice"
                label="预计销售单价(元)"
                placeholder="请输入"
                type="number"
                @change="calcTotalCum"
                required
                :rules="[
                  {
                    required: true,
                    message: '请输入预计销售单价(元)',
                  },
                ]"
              />
              <van-field :value="tempValue.fdTotalSum" name="fdTotalSum" label="预售总金额(元)" readonly />
              <van-field
                v-model="tempValue.fdShippingDate"
                name="fdShippingDate"
                label="预出货日期"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showDate = true"
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择预出货日期',
                  },
                ]"
              />
              <van-field
                v-model="tempValue.fdRemake"
                name="fdRemake"
                label="备注/定制说明"
                placeholder="请输入"
                type="textarea"
              />
              <van-field
                v-model="tempValue.fdCustomFeeBearer"
                name="fdCustomFeeBearer"
                label="定制费承担方"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showFee = true"
              />
            </block>
          </van-form>
        </div>
      </template>

      <selection-product-line
        searchable
        :value="
          !!tempValue.fdProductLineCode
            ? [
                {
                  value: tempValue.fdProductLineCode,
                  text: tempValue.fdProductLineName,
                },
              ]
            : []
        "
        title="选择产品线"
        :visible.sync="showProductLine"
        @change="handleChangeProductLine"
      />

      <selection-product-cate
        :value="
          !!tempValue.fdProductCategoryCode
            ? [
                {
                  value: tempValue.fdProductCategoryCode,
                  text: tempValue.fdProductCategoryName,
                },
              ]
            : []
        "
        :visible.sync="showProductCate"
        title="选择产品类型"
        @change="handleChangeProductCate"
      />

      <selection-product
        searchable
        :productLineCode="tempValue.fdProductLineCode"
        :value="
          !!tempValue.fdProductId
            ? [
                {
                  value: tempValue.fdProductId,
                  text: tempValue.fdProductName,
                },
              ]
            : []
        "
        :visible.sync="showProduct"
        title="选择产品型号"
        @change="handleChangeProduct"
      />

      <selection-fee-bearer
        :value="
          !!tempValue.fdCustomFeeBearer
            ? [
                {
                  value: tempValue.fdCustomFeeBearer,
                  text: tempValue.fdCustomFeeBearer,
                },
              ]
            : []
        "
        title="选择定制费承担方"
        :visible.sync="showFee"
        @change="tempValue.fdCustomFeeBearer = ($event[0] || {}).value"
      />

      <van-popup :get-container="getDocumentBody" v-model="showDate" position="bottom">
        <van-datetime-picker
          type="date"
          :max-date="CALENDAR_MAX_DATE"
          :min-date="CALENDAR_MIN_DATE"
          @confirm="handleChangeDate"
        />
      </van-popup>
    </list-layout>
  </van-popup>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';
import { commonMixin } from '@/views/mixins';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionProduct from '@/views/components/selection/product';
import SelectionProductCate from '../components/selection/product-cate';
import SelectionFeeBearer from '../components/selection/fee-bearer';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineCode: '',
    fdProductLineName: '',
    fdProductCategoryCode: '',
    fdProductCategoryName: '',
    fdProductId: '',
    fdProductName: '',
    fdCustomFeeBearer: '',
    fdIsValid: '1',
    fdShippingDate: '',
  },
});

export default {
  name: 'setting-product',
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    SelectionProductLine,
    SelectionProductCate,
    SelectionProduct,
    SelectionFeeBearer,
  },
  data() {
    return {
      showProductLine: false,
      showProductCate: false,
      showProduct: false,
      showDate: false,
      showFee: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.onOk();
    },
    calcTotalCum() {
      const { fdNum, fdPrice } = this.tempValue;

      this.tempValue = {
        ...this.tempValue,
        fdTotalSum: this.getAmount((fdNum || 0) * (fdPrice || 0)),
      };
    },
    async handleChangeProductCate(res) {
      this.tempValue.fdProductCategoryCode = (res[0] || {}).value;
      this.tempValue.fdProductCategoryName = (res[0] || {}).text;

      if (this.tempValue.fdProductCategoryCode === '完全定制化') {
        const data = await api.basedata
          .getProductList({
            limit: 200,
            pageNo: 1,
            fdIsDingzhihua: '1',
          })
          .then((res) => res.data || []);
        this.tempValue.fdProductId = (data[0] || {}).fdProductSku;
        this.tempValue.fdProductName = (data[0] || {}).fdProductName;
      } else {
        if (this.tempValue.fdProductName === '自定义产品') {
          this.tempValue.fdProductId = '';
          this.tempValue.fdProductName = '';
        }
      }
    },
    handleChangeProductLine(res) {
      this.tempValue.fdProductLineCode = (res[0] || {}).value;
      this.tempValue.fdProductLineName = (res[0] || {}).text;
      this.tempValue.fdProductId = '';
      this.tempValue.fdProductName = '';
      this.tempValue.fdProductCategoryCode = '';
      this.tempValue.fdProductCategoryName = '';
    },
    handleChangeProduct(res) {
      this.tempValue.fdProductId = (res[0] || {}).value;
      this.tempValue.fdProductName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).fdProductLineCode;
      this.tempValue.fdProductLineName = (res[0] || {}).fdProductLineName;
    },
    handleChangeDate(res) {
      this.tempValue.fdShippingDate = dayjs(res).format('YYYY-MM-DD');
      this.showDate = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
