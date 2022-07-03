<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="readOnly ? undefined : rules"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <p-row :gutter="24">
        <p-col :span="8">
          <p-form-model-item label="产品线" prop="fdProductLineName">
            <!-- <p-input v-model="tempValue.fdProductLineName" readOnly /> -->
            <select-product-line
              :crmCode="crmCode"
              :value="
                !!tempValue.fdProductLineName
                  ? [
                      {
                        text: tempValue.fdProductLineName,
                        value: tempValue.fdProductLineCode,
                      },
                    ]
                  : []
              "
              allow-clear
              :placeholder="
                readOnly || fzReadOnly || !!tempValue.fdProductSourceNo
                  ? undefined
                  : '请选择'
              "
              :readOnly="readOnly || fzReadOnly || !!tempValue.fdProductSourceNo"
              @change="handleChangeProductLine"
            />
          </p-form-model-item>
        </p-col>

        <p-col :span="8">
          <p-form-model-item label="产品型号" prop="fdProductName">
            <select-product
              :need="['productLineCode']"
              :productLineCode="tempValue.fdProductLineCode"
              :value="
                !!tempValue.fdProductName
                  ? [
                      {
                        text: tempValue.fdProductName,
                        value: tempValue.fdProductCode,
                      },
                    ]
                  : []
              "
              allow-clear
              :placeholder="
                readOnly || fzReadOnly || !!tempValue.fdProductSourceNo
                  ? undefined
                  : '请选择'
              "
              :readOnly="readOnly || fzReadOnly || !!tempValue.fdProductSourceNo"
              @change="handleChangeProduct"
            />
          </p-form-model-item>
        </p-col>

        <p-col :span="8">
          <p-form-model-item label="产品编码" prop="fdProductCode">
            <p-input v-model="tempValue.fdProductCode" readOnly />
            <!-- <select-product
              :need="['productLineCode']"
              :getText="getProductText"
              :productLineCode="tempValue.fdProductLineCode"
              :value="
                !!tempValue.fdProductCode
                  ? [
                      {
                        text: tempValue.fdProductCode,
                        value: tempValue.fdProductCode,
                      },
                    ]
                  : []
              "
              allow-clear
              :placeholder="
                readOnly || fzReadOnly || !!tempValue.fdProductSourceNo
                  ? undefined
                  : '请选择'
              "
              :readOnly="readOnly || fzReadOnly || !!tempValue.fdProductSourceNo"
              @change="handleChangeProduct"
            /> -->
          </p-form-model-item>
        </p-col>

        <p-col :span="8">
          <p-form-model-item label="机器标识" prop="fdMachineType">
            <select-dict
              style="width: 100%"
              systemCode="cpms"
              dictCode="cpms_order_machine_type"
              :value="
                !!tempValue.fdMachineType
                  ? [
                      {
                        value: tempValue.fdMachineType,
                      },
                    ]
                  : []
              "
              allow-clear
              :placeholder="readOnly || fzReadOnly ? undefined : '请选择'"
              :readOnly="readOnly || fzReadOnly"
              @change="handleChangeMachineType"
            />
          </p-form-model-item>
        </p-col>

        <p-col :span="8" v-if="needWarehouse">
          <p-form-model-item label="仓库" prop="fdWarehouseName">
            <p-input
              :value="tempValue.fdWarehouseName"
              readOnly
              :placeholder="readOnly || fzReadOnly ? undefined : '请选择'"
              @click="readOnly || fzReadOnly ? undefined : handleSelectWarehouse()"
            >
              <template
                #suffix
                v-if="tempValue.fdWarehouseName && !readOnly && !fzReadOnly"
              >
                <p-icon
                  @click="handleDeleteWarehouseName"
                  type="close-circle"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </template>
            </p-input>
          </p-form-model-item>
        </p-col>

        <p-col :span="8" v-if="needWarehouse">
          <p-form-model-item label="可用库存" prop="fdAvailableStock">
            <p-input v-model="tempValue.fdAvailableStock" readOnly />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="要货数量" prop="fdApplyCount">
            <p-input-number
              style="width: 100%"
              :min="0"
              :step="1"
              :precision="0"
              v-model="tempValue.fdApplyCount"
              :placeholder="readOnly ? undefined : '请输入'"
              :readOnly="readOnly"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="净供价" prop="fdCurrentSupplyPrice">
            <p-input :value="formatAmount(tempValue.fdCurrentSupplyPrice)" readOnly />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="申请净供价" prop="fdApplySupplyPrice">
            <p-input :value="formatAmount(tempValue.fdApplySupplyPrice)" readOnly />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="销售价" prop="fdSalePrice">
            <p-input-number
              style="width: 100%"
              :min="0"
              :step="1"
              :precision="2"
              v-model="tempValue.fdSalePrice"
              :placeholder="readOnly ? undefined : '请输入'"
              :readOnly="readOnly"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="折扣%" prop="fdDiscount">
            <p-input-number
              style="width: 100%"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              v-model="tempValue.fdDiscount"
              :placeholder="readOnly || fzReadOnly ? undefined : '请输入'"
              :readOnly="readOnly || fzReadOnly"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="金额" prop="fdSettleAmount">
            <p-input :value="formatAmount(fdSettleAmount)" readOnly />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="税率%" prop="fdTaxRate">
            <p-input-number
              style="width: 100%"
              :min="0"
              :max="100"
              :step="1"
              :precision="0"
              v-model="tempValue.fdTaxRate"
              :placeholder="readOnly || fzReadOnly ? undefined : '请输入'"
              :readOnly="readOnly || fzReadOnly"
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="产品来源" prop="fdProductSourceNo">
            <p-input :value="tempValue.fdProductSourceNo" readOnly />
          </p-form-model-item>
        </p-col>
      </p-row>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" :loading="loading" @click="handleSubmit">确 定</p-button>
    </span>

    <selection-warehouse
      :mode="billType === 'ELECTRONIC_SALES_ORDER' ? 'rdc' : 'default'"
      :countyCode="countyCode"
      :productCode="tempValue.fdProductCode"
      :productLineCode="tempValue.fdProductLineCode"
      :partyCode="partyCode"
      :visible.sync="showWarehouse"
      @change="handleChangeWarehouse"
    />
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

import SelectProduct from '@/views/components/select/product';
import SelectProductLine from '../components/select/product-line';
import SelectMachineId from '../components/select/machine-id';
import SelectionWarehouse from '../components/selection-warehouse';

import { defaultProductItem } from './data';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: defaultProductItem,
});

export default {
  name: 'setting-product',
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectProduct,
    SelectMachineId,
    SelectionWarehouse,
    SelectProductLine,
  },
  props: {
    fzReadOnly: {
      type: Boolean,
    },
    crmCode: {
      type: String,
    },
    partyCode: {
      type: String,
    },
    countyCode: {
      type: String,
    },
    moduleId: {
      type: String,
    },
    billType: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      showWarehouse: false,
      getProductText: (d) => {
        return d.fdProductSku;
      },
    };
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}产品`;
    },
    needWarehouse() {
      return this.billType !== 'SALES_DELAY_ORDER';
    },
    rules() {
      return {
        fdProductLineName: [
          {
            required: true,
            message: '请选择产品线',
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
        fdProductCode: [
          {
            required: true,
            message: '请选择产品编码',
            trigger: 'change',
          },
        ],
        fdWarehouseName: [
          {
            required: this.needWarehouse,
            message: '请选择仓库',
            trigger: 'change',
          },
        ],
        fdMachineType: [
          {
            required: true,
            message: '请选择机器标识',
            trigger: 'change',
          },
        ],
        fdApplyCount: [
          {
            required: true,
            message: '请输入要货数量',
            trigger: 'blur',
          },
        ],
        fdSalePrice: [
          {
            required: true,
            message: '请输入销售价',
            trigger: 'blur',
          },
        ],
        fdDiscount: [
          {
            required: true,
            message: '请输入折扣',
            trigger: 'blur',
          },
        ],
        fdTaxRate: [
          {
            required: true,
            message: '请输入税率',
            trigger: 'blur',
          },
        ],
      };
    },
    fdSettleAmount() {
      const { fdApplyCount = 0, fdSalePrice = 0, fdDiscount = 100 } = this.tempValue;
      const v = this.getAmount(fdApplyCount * fdSalePrice * (fdDiscount / 100));
      return v;
    },
  },
  methods: {
    handleDeleteWarehouseName() {
      this.tempValue.fdWarehouseName = '';
      this.tempValue.fdWarehouseCode = '';
      this.tempValue.fdAvailableStock = 0;
    },
    handleCheck() {
      const {
        fdAvailableStock = 0,
        fdApplyCount = 0,
        fdSalePrice = 0,
        fdCurrentSupplyPrice = 0,
      } = this.tempValue;

      if (fdApplyCount <= 0) {
        this.$message.error('要货数量禁止小于等于0');
        return false;
      }

      if (this.needWarehouse && fdApplyCount > fdAvailableStock) {
        this.$message.error('要货数量禁止大于可用库存');
        return false;
      }

      if (fdSalePrice <= 0) {
        this.$message.error('销售价禁止小于等于0');
        return false;
      }

      if (fdSalePrice < fdCurrentSupplyPrice) {
        this.$message.error('销售价禁止小于净供价');
        return false;
      }

      return true;
    },
    handleSubmit() {
      this.tempValue = {
        ...this.tempValue,
        fdSettleAmount: this.fdSettleAmount,
      };

      this.$refs.form.validate(async (valid) => {
        if (!valid || !this.handleCheck()) {
          return;
        }

        this.loading = true;

        try {
          if (!!this.moduleId) {
            if (!!this.tempValue.id) {
              await api.order.putEditProductList([this.tempValue]);
            } else {
              await api.order.postAddProductList([
                {
                  ...this.tempValue,
                  fdMainId: this.moduleId,
                },
              ]);
            }
          }
          this.onOk();
        } finally {
          this.loading = false;
        }
      });
    },
    handleSelectWarehouse() {
      if (!this.tempValue.fdProductCode) {
        this.$message.error('未选择产品型号');
        return;
      }

      if (this.billType === 'ELECTRONIC_SALES_ORDER') {
        if (!this.countyCode) {
          this.$message.error('请优先选择区编码');
          return;
        }
      } else {
        if (!this.partyCode) {
          this.$message.error('请优先选择销售部编码');
          return;
        }
      }
      this.showWarehouse = true;
    },
    handleChangeMachineType(res) {
      const v = res[0] || {};
      this.tempValue.fdMachineType = v.value;
    },
    handleChangeProductLine(res) {
      const v = res[0] || {};
      this.tempValue.fdProductLineName = v.text;
      this.tempValue.fdProductLineCode = v.value;
      this.tempValue.fdWarehouseCode = '';
      this.tempValue.fdWarehouseName = '';
      this.tempValue.fdProductCode = '';
      this.tempValue.fdProductName = '';
      this.tempValue.fdAvailableStock = 0;
      this.tempValue.fdCurrentSupplyPrice = 0;
      this.tempValue.fdApplySupplyPrice = 0;
      this.tempValue.fdCurrentSupplyPrice = 0;
    },
    async handleChangeProduct(res) {
      const v = res[0] || {};
      // this.tempValue.fdProductLineName = v.fdProductLineName;
      // this.tempValue.fdProductLineCode = v.fdProductLineCode;
      this.tempValue.fdProductCode = v.fdProductSku;
      this.tempValue.fdProductName = v.text;
      this.tempValue.fdWarehouseCode = '';
      this.tempValue.fdWarehouseName = '';
      this.tempValue.fdAvailableStock = 0;
      this.tempValue.fdCurrentSupplyPrice = 0;
      this.tempValue.fdApplySupplyPrice = 0;

      if (this.tempValue.fdProductCode) {
        const price = await api.basedata
          .getProductPrice({
            productCodes: [this.tempValue.fdProductCode],
          })
          .then((res) => (res || [])[0]);

        !!price && (this.tempValue.fdCurrentSupplyPrice = price.productPrice);
      }
    },
    handleChangeWarehouse(res) {
      const v = res[0] || {};
      this.tempValue.fdWarehouseCode = v.warehouseCode;
      this.tempValue.fdWarehouseName = v.warehouseName;
      this.tempValue.fdAvailableStock = v.stockCount;
    },
  },
};
</script>
