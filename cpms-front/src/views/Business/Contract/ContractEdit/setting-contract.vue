<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="600px"
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
                @change="handleChangeFdProductLineCode"
                allow-clear
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="产品类型" prop="fdProductCategoryName">
              <select-product-cate
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
                allow-clear
                @change="handleChangeFdProductCategoryCode"
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
                placeholder="请选择"
                @change="handleChangeFdProductId"
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
            <p-form-model-item label="产品单价(元)" prop="fdProductUnitPrice">
              <p-input-number
                style="width: 100%"
                step="0.01"
                precision="2"
                placeholder="请输入"
                v-model="tempValue.fdProductUnitPrice"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="安装费(元)" prop="fdInstallCost">
              <p-input-number
                style="width: 100%"
                step="0.01"
                precision="2"
                placeholder="请输入"
                v-model="tempValue.fdInstallCost"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="上楼费(元)" prop="fdUpstairsCost">
              <p-input-number
                style="width: 100%"
                step="0.01"
                precision="2"
                placeholder="请输入"
                v-model="tempValue.fdUpstairsCost"
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="12">
            <p-form-model-item label="运费(元)" prop="fdFreight">
              <p-input-number
                style="width: 100%"
                step="0.01"
                precision="2"
                placeholder="请输入"
                v-model="tempValue.fdFreight"
              /> </p-form-model-item
          ></p-col>
          <p-col :span="12">
            <p-form-model-item label="合计单价(元)" prop="fdTotalUnitPrice">
              <p-input
                read-only
                :value="formatAmount(fdTotalUnitPrice)"
              /> </p-form-model-item
          ></p-col>
          <p-col :span="12">
            <p-form-model-item label="总金额(元)" prop="fdTotalAmount">
              <p-input
                read-only
                :value="formatAmount(fdTotalAmount)"
              /> </p-form-model-item
          ></p-col>
          <p-col :span="12">
            <p-form-model-item label="交货计划" prop="fdDeliveryPlan">
              <p-date-picker
                v-model="tempValue.fdDeliveryPlan"
                valueFormat="YYYY-MM-DD"
              /> </p-form-model-item
          ></p-col>
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
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SelectProductLine from '@/views/components/select/product-line';
import SelectProduct from '@/views/components/select/product';
import SelectProductCate from '@/views/Business/components/select/product-cate';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineCode: '',
    fdProductLineName: '',
    fdProductCategoryName: '',
    fdProductCategoryCode: '',
    fdProductId: '',
    fdProductName: '',
    fdQuantity: 0, //数量
    fdProductUnitPrice: 0, //产品单价
    fdInstallCost: 0, //安装费
    fdUpstairsCost: 0, //上楼费
    fdFreight: 0, //运费
    fdTotalUnitPrice: 0, //合计单价
    fdTotalAmount: 0, //总金额
    fdDeliveryPlan: '',
  },
});

export default {
  name: 'setting-contact',
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectProductLine,
    SelectProduct,
    SelectProductCate,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}产品信息`;
    },
    //合计单价
    fdTotalUnitPrice() {
      return this.getAmount(
        (this.tempValue.fdProductUnitPrice || 0) * (this.tempValue.fdQuantity || 0)
      );
    },
    // 总金额
    fdTotalAmount() {
      return this.getAmount(
        this.fdTotalUnitPrice +
          (this.tempValue.fdInstallCost || 0) +
          (this.tempValue.fdUpstairsCost || 0) +
          (this.tempValue.fdFreight || 0)
      );
    },
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      rules: {
        fdProductLineCode: [
          {
            required: true,
            message: '请选择产品线',
            trigger: 'change',
          },
        ],
        fdProductCategoryName: [
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
        fdProductUnitPrice: [
          {
            required: true,
            message: '请输入产品单价(元)',
            trigger: 'blur',
          },
        ],
        fdInstallCost: [
          {
            required: true,
            message: '请输入安装费',
            trigger: 'blur',
          },
        ],
        fdUpstairsCost: [
          {
            required: true,
            message: '请输入上楼费',
            trigger: 'blur',
          },
        ],
        fdFreight: [
          {
            required: true,
            message: '请输入运费',
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
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.tempValue = {
          ...this.tempValue,
          fdTotalUnitPrice: this.fdTotalUnitPrice,
          fdTotalAmount: this.fdTotalAmount,
        };

        this.onOk();
      });
    },
  },
};
</script>
