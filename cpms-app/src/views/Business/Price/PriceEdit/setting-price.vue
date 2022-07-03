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
          title="价格明细设置"
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
                is-link
                required
                readonly
                :rules="[{ required: true }]"
                v-model="tempValue.fdProductLineName"
                name="fdProductLineCode"
                label="产品线"
                placeholder="请选择产品线"
                @click="showProductLineCode = true"
              />
              <van-field
                is-link
                required
                readonly
                :rules="[{ required: true }]"
                v-model="tempValue.fdProductCategoryName"
                name="fdProductCategoryName"
                label="产品类型"
                placeholder="请选择产品类型"
                @click="showProductCategoryName = true"
              />
              <van-field
                is-link
                required
                readonly
                :rules="[{ required: true }]"
                v-model="tempValue.fdProductName"
                name="fdProductName"
                label="产品型号"
                placeholder="请选择产品型号"
                @click="showProductName = true"
              />
              <van-field :value="tempValue.fdProductId" readonly label="产品编码" />
              <van-field
                type="digit"
                required
                :rules="[{ required: true }]"
                v-model="tempValue.fdQuantity"
                name="fdQuantity"
                label="数量"
                placeholder="请输入数量"
              />
              <van-field
                label="现净供价(元)"
                name="fdCurrentNetSupplyPrice"
                placeholder="请输入"
                readonly
                v-model="tempValue.fdCurrentNetSupplyPrice"
              />
              <van-field
                required
                :rules="[{ required: true }]"
                type="number"
                label="申请净供价(元)"
                placeholder="请输入申请净供价"
                name="fdApplyForNetContribution"
                v-model="tempValue.fdApplyForNetContribution"
              />
              <van-field
                label="单台价差(元)"
                name="fdSinglePrice"
                readonly
                :value="(tempValue.fdSinglePrice = fdSinglePrice)"
              />
              <van-field
                required
                :rules="[{ required: true }]"
                type="number"
                label="实际开单价(元)"
                name="fdActualOrderPrice"
                placeholder="请输入实际开单价"
                v-model="tempValue.fdActualOrderPrice"
              />
              <van-field
                required
                :rules="[{ required: true }]"
                type="number"
                label="安装费(元)"
                name="fdInstallCost"
                placeholder="请输入安装费"
                v-model="tempValue.fdInstallCost"
              />
              <van-field
                required
                :rules="[{ required: true }]"
                type="number"
                v-model="tempValue.fdUpstairsCost"
                name="fdUpstairsCost"
                label="上楼费(元)"
                placeholder="请输入上楼费"
              />
              <van-field
                required
                :rules="[{ required: true }]"
                type="number"
                v-model="tempValue.fdSingleProjectCost"
                name="fdSingleProjectCost"
                label="单台项目费用(元)"
                placeholder="请输入单台项目费用"
              />
              <van-field
                type="number"
                label="开单总金额(元)"
                name="fdTotalAmount"
                placeholder="请输入"
                readonly
                :value="formatAmount((tempValue.fdTotalAmount = fdTotalAmount))"
              />
              <van-field
                readonly
                label="总项目费用(元)"
                name="fdTotalProjectCost"
                placeholder="请输入"
                :value="formatAmount((tempValue.fdTotalProjectCost = fdTotalProjectCost))"
              />
              <van-field
                readonly
                label="总申请价格资源(元)"
                name="fdTotalApplyPriceAssets"
                placeholder="请输入"
                :value="formatAmount((tempValue.fdTotalApplyPriceAssets = fdTotalApplyPriceAssets))"
              />
              <van-field
                is-link
                required
                readonly
                :rules="[{ required: true }]"
                label="交货计划"
                name="fdDeliveryPlan"
                placeholder="请选择日期"
                :value="tempValue.fdDeliveryPlan | planTime"
                @click="deliveryTime = true"
              />
            </block>
          </van-form>
        </div>
      </template>
      <selection-product-line
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
        placeholder="请选择"
        :visible.sync="showProductLineCode"
        @change="handleChangefdProductLineCode"
        searchable
      />
      <selection-product-cate
        :noDIY="true"
        :value="
          !!tempValue.fdProductCategoryName
            ? [
                {
                  value: tempValue.fdProductCategoryCode,
                  text: tempValue.fdProductCategoryName,
                },
              ]
            : []
        "
        placeholder="请选择"
        :visible.sync="showProductCategoryName"
        @change="handleChangefdProductCategoryCode"
        searchable
      />
      <selection-product
        searchable
        :productLineCode="tempValue.fdProductLineCode"
        :value="
          !!tempValue.fdProductName
            ? [
                {
                  value: tempValue.fdProductId,
                  text: tempValue.fdProductName,
                },
              ]
            : []
        "
        placeholder="请选择"
        :visible.sync="showProductName"
        @change="handleChangefdProductId"
      />
      <van-popup v-model="deliveryTime" position="bottom">
        <van-datetime-picker
          type="date"
          title="交货时间"
          @cancel="deliveryTime = false"
          @confirm="handledeliveryTime"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionProductCate from '@/views/Business/components/selection/product-cate';
import SelectionProduct from '@/views/components/selection/product';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineName: '',
    fdProductLineCode: '',
    fdProductCategoryName: '',
    fdProductCategoryCode: '',
    fdProductId: '',
    fdIsValid: '1',
    fdMainId: '',
    version: '',
    fdProductName: '',
    fdQuantity: 0,
    fdCurrentNetSupplyPrice: 0,
    fdApplyForNetContribution: 0,
    fdSinglePrice: 0,
    fdActualOrderPrice: 0,
    fdInstallCost: 0,
    fdUpstairsCost: 0,
    fdSingleProjectCost: 0,
    fdTotalAmount: 0,
    fdTotalProjectCost: 0,
    fdTotalApplyPriceAssets: 0,
    fdDeliveryPlan: '',
  },
});

export default {
  name: 'setting-price',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SelectionProductLine,
    SelectionProductCate,
    SelectionProduct,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}价格信息`;
    },
    //开单总金额(元)
    fdTotalAmount() {
      return this.getAmount(
        (parseFloat(this.tempValue.fdActualOrderPrice) || 0) * (parseFloat(this.tempValue.fdQuantity) || 0) +
          (parseFloat(this.tempValue.fdInstallCost) || 0) +
          (parseFloat(this.tempValue.fdUpstairsCost) || 0)
      );
    },
    // 总项目费用
    fdTotalProjectCost() {
      return this.getAmount(
        (parseFloat(this.tempValue.fdSingleProjectCost) || 0) * (parseFloat(this.tempValue.fdQuantity) || 0)
      );
    },
    // 总申请价格资源
    fdTotalApplyPriceAssets() {
      const t = Number(this.tempValue.fdCurrentNetSupplyPrice);
      return typeof t === 'number' ? this.getAmount((this.fdSinglePrice || 0) * (this.tempValue.fdQuantity || 0)) : '';
    },

    // 单台价差
    fdSinglePrice() {
      const t = Number(this.tempValue.fdCurrentNetSupplyPrice);
      return typeof t === 'number' ? this.getAmount((this.tempValue.fdApplyForNetContribution || 0) - (t || 0)) : '';
    },
  },
  data() {
    return {
      showProductLineCode: false,
      showProductCategoryName: false,
      showProductName: false,
      deliveryTime: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
    };
  },
  filters: {
    planTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(v).format('YYYY-MM-DD');
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      // const xxx = Number(this.tempValue.xxx)
      // xx: typeof xxx === 'number' ? xxx : ''
      this.onOk();
    },
    handleChangefdProductLineCode(res) {
      this.tempValue.fdProductLineCode = res[0].value;
      this.tempValue.fdProductLineName = res[0].text;
      this.tempValue.fdProductId = '';
      this.tempValue.fdProductName = '';
      this.tempValue.fdProductCategoryCode = '';
      this.tempValue.fdProductCategoryName = '';
    },
    async handleChangefdProductCategoryCode(res) {
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
    async handleChangefdProductId(res) {
      this.tempValue.fdProductId = (res[0] || {}).value;
      this.tempValue.fdProductName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).fdProductLineCode;
      this.tempValue.fdProductLineName = (res[0] || {}).fdProductLineName;
      const productPrice = await api.basedata.getProductPrice(
        { productCodes: this.tempValue.fdProductId }
        // { productCodes: "010107062542", productCodes: "012204000948" }
        // ["010107062542", "012204000948"]
      );
      this.tempValue.fdCurrentNetSupplyPrice = (productPrice || [])
        .map((d) => {
          return d.productPrice;
        })
        .join(',');
    },
    handledeliveryTime(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.tempValue.fdDeliveryPlan = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.deliveryTime = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
