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
          title="产品明细设置"
          left-text="取消"
          left-arrow
          right-text="确定"
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
                v-model="tempValue.fdProductLineName"
                :rules="[
                  {
                    required: true,
                    message: '请选择产品线',
                    trriger: 'change',
                  },
                ]"
                name="fdProductLineName"
                label="产品线"
                placeholder="请选择"
                @click="showProductLine = true"
              />
              <van-field
                is-link
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择产品类型',
                    trriger: 'change',
                  },
                ]"
                v-model="tempValue.fdProductCategoryName"
                name="fdProductCategoryName"
                label="产品类型"
                placeholder="请选择"
                @click="showProductCate = true"
              />
              <van-field
                is-link
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择产品型号',
                    trriger: 'change',
                  },
                ]"
                v-model="tempValue.fdProductName"
                name="fdProductName"
                label="产品型号"
                placeholder="请选择"
                @click="showProductName = true"
              />
              <van-field :value="tempValue.fdProductId" readonly label="产品编码" />
              <van-field
                required
                :rules="[{ required: true, message: '请输入数量', trriger: 'blur' }]"
                v-model="tempValue.fdQuantity"
                name="fdQuantity"
                type="number"
                label="数量"
                placeholder="请输入"
              />
              <van-field
                label="产品单价(元)"
                required
                type="number"
                :rules="[
                  {
                    required: true,

                    message: '请输入产品单价',
                    trriger: 'blur',
                  },
                ]"
                v-model="tempValue.fdProductUnitPrice"
                name="fdProductUnitPrice"
                placeholder="请输入"
              />
              <van-field
                required
                type="number"
                :rules="[
                  {
                    required: true,
                    message: '请输入安装费',
                    trriger: 'blur',
                  },
                ]"
                name="fdInstallCost"
                v-model="tempValue.fdInstallCost"
                label="安装费(元)"
                placeholder="请输入"
              />
              <van-field
                required
                type="number"
                :rules="[
                  {
                    required: true,
                    message: '请输入上楼费',
                    trriger: 'blur',
                  },
                ]"
                name="fdUpstairsCost"
                v-model="tempValue.fdUpstairsCost"
                label="上楼费(元)"
                placeholder="请输入"
              />
              <van-field
                required
                type="number"
                :rules="[
                  {
                    required: true,
                    message: '请输入运费',
                    trriger: 'blur',
                  },
                ]"
                name="fdFreight"
                v-model="tempValue.fdFreight"
                label="运费(元)"
                placeholder="请输入"
              />
              <van-field
                name="fdTotalUnitPrice"
                readonly
                :value="formatAmount(fdTotalUnitPrice)"
                label="合计单价(元)"
                type="number"
                placeholder="请输入"
              />
              <van-field
                :value="formatAmount(fdTotalAmount)"
                name="fdTotalAmount"
                label="总金额(元)"
                readonly
                placeholder="请输入"
              />
              <van-field
                is-link
                required
                :rules="[
                  {
                    required: true,
                    message: '请选择交货计划',
                    trriger: 'change',
                  },
                ]"
                v-model="tempValue.fdDeliveryPlan"
                name="fdDeliveryPlan"
                label="交货计划"
                placeholder="请选择"
                @click="showDeliveryPlan = true"
              />
            </block>
          </van-form>
        </div>
      </template>

      <selection-product-line
        :value="
          !!tempValue.fdProductLineName
            ? [
                {
                  value: tempValue.fdProductLineCode,
                  text: tempValue.fdProductLineName,
                },
              ]
            : []
        "
        title="选择产品线"
        @change="handleChangeFdProductLineCode"
        allow-clear
        :visible.sync="showProductLine"
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
        title="选择产品类型"
        allow-clear
        @change="handleChangeFdProductCategoryCode"
        :visible.sync="showProductCate"
      />

      <selection-product
        searchable
        :productLineCode="tempValue.fdProductLineCode"
        allow-clear
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
        @change="handleChangeFdProductId"
        :visible.sync="showProductName"
        title="选择产品型号"
      />

      <van-popup v-model="showDeliveryPlan" position="bottom">
        <van-datetime-picker
          type="date"
          title="选择交货计划"
          @cancel="showDeliveryPlan = false"
          @confirm="handleBeginTimeConfirm"
          :min-date="minDate"
        />
      </van-popup>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionProduct from '@/views/components/selection/product';
import SelectionProductCate from '@/views/Business/components/selection/product-cate';
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineCode: '',
    fdProductLineName: '',
    fdProductCategoryName: '',
    fdProductCategoryCode: '',
    fdProductId: '',
    fdProductName: '',
    fdQuantity: '', //数量
    fdProductUnitPrice: '', //产品单价
    fdInstallCost: 0, //安装费
    fdUpstairsCost: 0, //上楼费
    fdFreight: 0, //运费
    fdTotalUnitPrice: 0, //合计单价
    fdTotalAmount: 0, //总金额
    fdDeliveryPlan: '',
  },
});

export default {
  name: 'setting-contract',
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectionProductLine,
    SelectionProduct,
    SelectionProductCate,
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}产品信息`;
    },
    //合计单价
    fdTotalUnitPrice() {
      return this.getAmount(Number((this.tempValue.fdProductUnitPrice || 0) * (this.tempValue.fdQuantity || 0)));
    },
    // 总金额
    fdTotalAmount() {
      return this.getAmount(
        Number(
          this.fdTotalUnitPrice +
            parseFloat(this.tempValue.fdInstallCost || 0) +
            parseFloat(this.tempValue.fdUpstairsCost || 0) +
            parseFloat(this.tempValue.fdFreight || 0)
        )
      );
    },
  },
  data() {
    return {
      showProductLine: false,
      showProductCate: false,
      showProductName: false,
      showDeliveryPlan: false,
      minDate: new Date(),
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.tempValue = {
        ...this.tempValue,
        fdTotalUnitPrice: this.fdTotalUnitPrice,
        fdTotalAmount: this.fdTotalAmount,
      };
      this.onOk();
    },
    handleChangeFdProductLineCode(value) {
      this.tempValue.fdProductLineCode = (value[0] || {}).value;
      this.tempValue.fdProductLineName = (value[0] || {}).text;
      this.tempValue.fdProductId = '';
      this.tempValue.fdProductName = '';
      this.tempValue.fdProductCategoryCode = '';
      this.tempValue.fdProductCategoryName = '';
    },
    async handleChangeFdProductCategoryCode(value) {
      this.tempValue.fdProductCategoryCode = (value[0] || {}).value;
      this.tempValue.fdProductCategoryName = (value[0] || {}).text;

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
    handleChangeFdProductId(res) {
      this.tempValue.fdProductId = (res[0] || {}).value;
      this.tempValue.fdProductName = (res[0] || {}).text;
      this.tempValue.fdProductLineCode = (res[0] || {}).fdProductLineCode;
      this.tempValue.fdProductLineName = (res[0] || {}).fdProductLineName;
    },
    handleBeginTimeConfirm(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.tempValue.fdDeliveryPlan = dayjs(time).format('YYYY-MM-DD');
      this.showDeliveryPlan = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
