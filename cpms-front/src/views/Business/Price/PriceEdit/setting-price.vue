<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <block theme="primary">
      <p-form-model
        ref="form"
        :model="tempValue"
        :rules="rules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <p-row :gutter="24">
          <p-col :span="12">
            <p-form-model-item label="产品线" prop="fdProductLineCode">
              <select-product-line
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
                allow-clear
                @change="handleChangefdProductLineCode"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="产品类型" prop="fdProductCategoryCode">
              <select-product-cate
                :noDIY="true"
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
                placeholder="请选择"
                allow-clear
                @change="handleChangefdProductCategoryCode"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="产品型号" prop="fdProductName">
              <p-input
                v-if="tempValue.fdProductCategoryCode === '完全定制化'"
                placeholder="请输入"
                v-model="tempValue.fdProductName"
                read-only
              />
              <select-product
                :productLineCode="tempValue.fdProductLineCode"
                v-else
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
                allow-clear
                @change="handleChangefdProductId"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="产品编码">
              <p-input readOnly v-model="tempValue.fdProductId" />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="数量" prop="fdQuantity">
              <p-input-number
                style="width: 100%"
                :min="0"
                placeholder="请输入"
                v-model="tempValue.fdQuantity"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="现净供价(元)" prop="fdCurrentNetSupplyPrice">
              <p-input readOnly v-model="tempValue.fdCurrentNetSupplyPrice" />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="申请净供价(元)" prop="fdApplyForNetContribution">
              <p-input-number
                style="width: 100%"
                placeholder="请输入"
                step="0.01"
                precision="2"
                v-model="tempValue.fdApplyForNetContribution"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="单台价差(元)" prop="fdSinglePrice">
              <p-input readOnly :value="fdSinglePrice" />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="实际开单价(元)" prop="fdActualOrderPrice">
              <p-input-number
                style="width: 100%"
                placeholder="请输入"
                step="0.01"
                precision="2"
                v-model="tempValue.fdActualOrderPrice"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="安装费(元)" prop="fdInstallCost">
              <p-input-number
                style="width: 100%"
                placeholder="请输入"
                step="0.01"
                precision="2"
                v-model="tempValue.fdInstallCost"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="上楼费(元)" prop="fdUpstairsCost">
              <p-input-number
                style="width: 100%"
                placeholder="请输入"
                step="0.01"
                precision="2"
                v-model="tempValue.fdUpstairsCost"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="单台项目费用(元)" prop="fdSingleProjectCost">
              <p-input-number
                style="width: 100%"
                placeholder="请输入"
                step="0.01"
                precision="2"
                v-model="tempValue.fdSingleProjectCost"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="开单总金额(元)" prop="fdTotalAmount">
              <p-input read-only :value="formatAmount(fdTotalAmount)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="总项目费用(元)" prop="fdTotalProjectCost">
              <p-input read-only :value="formatAmount(fdTotalProjectCost)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="总申请价格资源(元)" prop="fdTotalApplyPriceAssets">
              <p-input
                read-only
                placeholder="请输入"
                :value="formatAmount(fdTotalApplyPriceAssets)"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="交货计划" prop="fdDeliveryPlan">
              <p-date-picker
                v-model="tempValue.fdDeliveryPlan"
                valueFormat="YYYY-MM-DD"
              />
            </p-form-model-item>
          </p-col>
        </p-row>
      </p-form-model>
    </block>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';

import api from '@/api';
import SelectProductLine from '@/views/components/select/product-line';
import SelectProduct from '@/views/components/select/product';
import SelectProductCate from '@/views/Business/components/select/product-cate';

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
    SelectProductCate,
    SelectProduct,
    SelectProductLine,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}价格信息`;
    },
    //开单总金额(元)
    fdTotalAmount() {
      return this.getAmount(
        (this.tempValue.fdActualOrderPrice || 0) * (this.tempValue.fdQuantity || 0) +
          (this.tempValue.fdInstallCost || 0) +
          (this.tempValue.fdUpstairsCost || 0)
      );
    },
    // 总项目费用
    fdTotalProjectCost() {
      return this.getAmount(
        (this.tempValue.fdSingleProjectCost || 0) * (this.tempValue.fdQuantity || 0)
      );
    },
    // 总申请价格资源
    fdTotalApplyPriceAssets() {
      return typeof this.tempValue.fdCurrentNetSupplyPrice === 'number'
        ? this.getAmount((this.fdSinglePrice || 0) * (this.tempValue.fdQuantity || 0))
        : '';
    },

    // 单台价差
    fdSinglePrice() {
      return typeof this.tempValue.fdCurrentNetSupplyPrice === 'number'
        ? this.getAmount(
            (this.tempValue.fdApplyForNetContribution || 0) -
              (this.tempValue.fdCurrentNetSupplyPrice || 0)
          )
        : '';
    },
  },
  data() {
    return {
      // fdEstimatedRevenue:'',
      rules: {
        fdProductLineCode: [
          {
            required: true,
            message: '请选择产品线',
            trigger: 'change',
          },
        ],
        fdProductCategoryCode: [
          {
            required: true,
            message: '请选择产品类型',
            trigger: 'change',
          },
        ],
        fdProductName: [
          {
            required: true,
            message: '请选择产品型号',
            trigger: 'change',
          },
        ],
        fdQuantity: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur',
          },
        ],
        // fdCurrentNetSupplyPrice: [
        //   {
        //     required: true,
        //     message: "请输入现净供价(元)",
        //     trigger: "blur",
        //   },
        // ],
        fdApplyForNetContribution: [
          {
            required: true,
            message: '请输入申请净供价(元)',
            trigger: 'blur',
          },
        ],
        fdActualOrderPrice: [
          {
            required: true,
            message: '请输入实际开单价(元)',
            trigger: 'blur',
          },
        ],
        fdInstallCost: [
          {
            required: true,
            message: '请输入安装费(元)',
            trigger: 'blur',
          },
        ],
        fdUpstairsCost: [
          {
            required: true,
            message: '请输入上楼费(元)',
            trigger: 'blur',
          },
        ],
        fdSingleProjectCost: [
          {
            required: true,
            message: '请输入单台项目费用(元)',
            trigger: 'blur',
          },
        ],
        fdDeliveryPlan: [
          {
            required: true,
            message: '请选择交货计划',
            trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
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
      this.tempValue.fdCurrentNetSupplyPrice = (productPrice[0] || {}).productPrice;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        if (typeof this.fdSinglePrice === 'number' && this.fdSinglePrice > 0) {
          this.$message.error('申请净供价不得高于现进供价');
          return;
        }
        this.tempValue = {
          ...this.tempValue,
          fdTotalProjectCost: this.fdTotalProjectCost,
          fdTotalAmount: this.fdTotalAmount,
          fdTotalApplyPriceAssets: this.fdTotalApplyPriceAssets,
          fdSinglePrice: this.fdSinglePrice,
        };
        this.onOk();
      });
    },
  },
};
</script>
