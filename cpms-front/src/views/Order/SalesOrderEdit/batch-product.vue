<template>
  <p-drawer
    class="batch-drawer"
    title="产品信息批量设置"
    placement="bottom"
    :visible="visible"
    @close="onCancel"
    :destroyOnClose="true"
    :maskClosable="false"
    height="70vh"
    :body-style="{ paddingBottom: '80px' }"
  >
    <p-form-model ref="form" :model="tempValue">
      <p-table
        class="batch-table"
        v-if="tempValue.orderProductListAddParamList.length > 0"
        :scroll="{ x: true }"
        :pagination="false"
        :columns="columns"
        :data-source="tempValue.orderProductListAddParamList"
        bordered
      >
        <template slot="fdProductLineName" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdProductLineName'"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <select-product-line
              style="width: 200px"
              :crmCode="tempValue.fdApplyCustomerCode"
              :value="
                !!record.fdProductLineName
                  ? [
                      {
                        text: record.fdProductLineName,
                        value: record.fdProductLineCode,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              :readOnly="!!record.fdProductSourceNo"
              @change="handleChangeProductLine(index, $event)"
            />
          </p-form-model-item>
        </template>

        <template slot="fdProductName" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdProductName'"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <select-product
              :need="['productLineCode']"
              :productLineCode="record.fdProductLineCode"
              style="width: 200px"
              :value="
                !!record.fdProductName
                  ? [
                      {
                        text: record.fdProductName,
                        value: record.fdProductCode,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              :readOnly="!!record.fdProductSourceNo"
              @change="handleChangeProduct(index, $event)"
            />
          </p-form-model-item>
        </template>

        <template slot="fdProductCode" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdProductCode'"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <select-product
              :need="['productLineCode']"
              :getText="getProductText"
              :productLineCode="record.fdProductLineCode"
              style="width: 200px"
              :value="
                !!record.fdProductCode
                  ? [
                      {
                        text: record.fdProductCode,
                        value: record.fdProductCode,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              :readOnly="!!record.fdProductSourceNo"
              @change="handleChangeProduct(index, $event)"
            />
          </p-form-model-item>
        </template>

        <template slot="fdMachineType" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdMachineType'"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <select-dict
              style="width: 150px"
              systemCode="cpms"
              dictCode="cpms_order_machine_type"
              :value="
                !!record.fdMachineType
                  ? [
                      {
                        value: record.fdMachineType,
                      },
                    ]
                  : []
              "
              allow-clear
              placeholder="请选择"
              @change="handleChangeMachineType(index, $event)"
            />
          </p-form-model-item>
        </template>

        <template slot="fdWarehouseName" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdWarehouseName'"
            :rules="{
              required: needWarehouse,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <p-input
              :value="record.fdWarehouseName"
              readOnly
              placeholder="请选择"
              @click="handleSelectWarehouse(index)"
            />
          </p-form-model-item>
        </template>
        <template slot="fdApplyCount" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdApplyCount'"
          >
            <p-input-number
              style="width: 150px"
              :min="0"
              :step="1"
              :precision="0"
              v-model="record.fdApplyCount"
              placeholder="请输入"
              @change="calcProductList"
            />
          </p-form-model-item>
        </template>

        <template slot="fdSalePrice" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdSalePrice'"
          >
            <p-input-number
              style="width: 150px"
              :min="0"
              :step="1"
              :precision="2"
              v-model="record.fdSalePrice"
              placeholder="请输入"
              @change="calcProductList"
            />
          </p-form-model-item>
        </template>

        <template slot="fdDiscount" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdDiscount'"
          >
            <p-input-number
              style="width: 150px"
              :min="0"
              :step="1"
              :precision="0"
              v-model="record.fdDiscount"
              placeholder="请输入"
              @change="calcProductList"
            />
          </p-form-model-item>
        </template>

        <template slot="fdTaxRate" slot-scope="text, record, index">
          <p-form-model-item
            :prop="'orderProductListAddParamList.' + index + '.fdTaxRate'"
          >
            <p-input-number
              style="width: 150px"
              :min="0"
              :step="1"
              :precision="0"
              v-model="record.fdTaxRate"
              placeholder="请输入"
            />
          </p-form-model-item>
        </template>

        <template slot="operation" slot-scope="text, record, index">
          <span>
            <p-button-link @click="handleAddItem(index + 1)">
              <p-icon type="plus-circle" />
            </p-button-link>
            <p-popconfirm
              v-if="!record.id || tempValue.fdStatus === 'draft'"
              title="是否确认删除当前行数据?"
              @confirm="handleDelItem(record, index)"
            >
              <p-button-link>
                <p-icon type="minus-circle" />
              </p-button-link>
            </p-popconfirm>
          </span>
        </template>
      </p-table>
      <p-empty
        v-else
        :description="false"
        style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)"
      >
        <span>暂无数据，</span>
        <p-button-link type="primary" @click="handleAddItem(0)"> 新增一条 </p-button-link>
      </p-empty>
    </p-form-model>

    <div class="batch-footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button
        style="width: 100px; margin-left: 8px"
        type="primary"
        @click="handleSubmit"
      >
        确 定
      </p-button>
    </div>

    <selection-warehouse
      :mode="tempValue.fdBillType === 'ELECTRONIC_SALES_ORDER' ? 'rdc' : 'default'"
      :countyCode="tempValue.fdAddrRegionCode"
      :partyCode="tempValue.fdSaleOfficeCode"
      :productCode="selectedItem.fdProductCode"
      :productLineCode="selectedItem.fdProductLineCode"
      :visible.sync="showWarehouse"
      @change="handleChangeWarehouse"
    />
  </p-drawer>
</template>

<script>
import lodash from 'lodash';
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

import SelectProduct from '@/views/components/select/product';
import SelectMachineId from '../components/select/machine-id';
import SelectionWarehouse from '../components/selection-warehouse';
import SelectProductLine from '../components/select/product-line';
import { defaultProductItem } from './data';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    orderProductListAddParamList: [],
  },
  getValue: (_, value) => {
    return lodash.cloneDeep(value);
  },
});

export default {
  name: 'batch-party',
  props: {
    moduleId: {
      type: String,
    },
  },
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectProduct,
    SelectMachineId,
    SelectionWarehouse,
    SelectProductLine,
  },
  data() {
    return {
      selectedIndex: -1,
      showWarehouse: false,
      getProductText: (d) => {
        return d.fdProductSku;
      },
    };
  },
  computed: {
    selectedItem() {
      return this.tempValue.orderProductListAddParamList[this.selectedIndex] || {};
    },
    needWarehouse() {
      return this.tempValue.fdBillType !== 'SALES_DELAY_ORDER';
    },
    columns() {
      const result = [
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '产品线',
          dataIndex: 'fdProductLineName',
          scopedSlots: { customRender: 'fdProductLineName' },
          className: 'required',
        },
        {
          title: '产品型号',
          dataIndex: 'fdProductName',
          scopedSlots: { customRender: 'fdProductName' },
          className: 'required',
        },
        {
          title: '产品编码',
          dataIndex: 'fdProductCode',
          scopedSlots: { customRender: 'fdProductCode' },
          className: 'required',
        },
        {
          title: '机器标识',
          dataIndex: 'fdMachineType',
          scopedSlots: { customRender: 'fdMachineType' },
          className: 'required',
        },
      ];

      if (this.needWarehouse) {
        result.push(
          ...[
            {
              title: '仓库',
              dataIndex: 'fdWarehouseName',
              scopedSlots: { customRender: 'fdWarehouseName' },
              className: this.needWarehouse ? 'required' : undefined,
            },
            {
              title: '可用库存',
              dataIndex: 'fdAvailableStock',
            },
          ]
        );
      }

      result.push(
        ...[
          {
            title: '要货数量',
            dataIndex: 'fdApplyCount',
            scopedSlots: { customRender: 'fdApplyCount' },
          },
          {
            title: '净供价',
            dataIndex: 'fdCurrentSupplyPrice',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '申请净供价',
            dataIndex: 'fdApplySupplyPrice',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '销售价',
            dataIndex: 'fdSalePrice',
            scopedSlots: { customRender: 'fdSalePrice' },
          },
          {
            title: '折扣%',
            dataIndex: 'fdDiscount',
            scopedSlots: { customRender: 'fdDiscount' },
          },
          {
            title: '金额',
            dataIndex: 'fdSettleAmount',
            customRender: (v) => this.formatAmount(v),
          },
          {
            title: '税率%',
            dataIndex: 'fdTaxRate',
            scopedSlots: { customRender: 'fdTaxRate' },
          },
          {
            title: '产品来源',
            dataIndex: 'fdProductSourceNo',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: 120,
            fixed: 'right',
            scopedSlots: { customRender: 'operation' },
          },
        ]
      );

      return result;
    },
  },
  methods: {
    calcProductList() {
      this.tempValue.orderProductListAddParamList.forEach((d) => {
        const { fdApplyCount = 0, fdSalePrice = 0, fdDiscount = 100 } = d;
        const v = this.getAmount(fdApplyCount * fdSalePrice * (fdDiscount / 100));
        d.fdSettleAmount = v;
      });
    },
    handleOk(submit) {
      this.tempValue.orderProductListAddParamList = [
        ...this.tempValue.orderProductListAddParamList,
      ];
      !!submit && this.onOk();
    },
    handleAddItem(index) {
      this.tempValue.orderProductListAddParamList.splice(index || 0, 0, {
        ...defaultProductItem,
      });
      this.handleOk();
    },
    handleDelItem(item, index) {
      this.tempValue.orderProductListAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleCheck() {
      const { orderProductListAddParamList = [] } = this.tempValue;

      if (
        !(orderProductListAddParamList || []).every((d) => {
          const { fdApplyCount = 0 } = d;
          if (fdApplyCount <= 0) {
            return false;
          }

          return true;
        })
      ) {
        this.$message.error('要货数量禁止小于等于0');
        return false;
      }

      if (
        !(orderProductListAddParamList || []).every((d) => {
          const { fdAvailableStock = 0, fdApplyCount = 0 } = d;
          if (this.needWarehouse && fdApplyCount > fdAvailableStock) {
            return false;
          }
          return true;
        })
      ) {
        this.$message.error('要货数量禁止大于可用库存');
        return false;
      }

      if (
        !(orderProductListAddParamList || []).every((d) => {
          const { fdSalePrice = 0, fdCurrentSupplyPrice = 0 } = d;
          if (fdSalePrice < fdCurrentSupplyPrice) {
            return false;
          }
          return true;
        })
      ) {
        this.$message.error('销售价禁止小于净供价');
        return false;
      }
      return true;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid || !this.handleCheck()) {
          return;
        }
        this.handleOk(true);
      });
    },
    handleChangeProductLine(index, res) {
      const v = res[0] || {};

      const item = this.tempValue.orderProductListAddParamList[index];
      item.fdProductLineName = v.text;
      item.fdProductLineCode = v.value;
      item.fdWarehouseCode = '';
      item.fdWarehouseName = '';
      item.fdAvailableStock = 0;
      item.fdCurrentSupplyPrice = 0;
      item.fdApplySupplyPrice = 0;
      item.fdCurrentSupplyPrice = 0;
    },
    async handleChangeProduct(index, res) {
      const v = res[0] || {};

      const item = this.tempValue.orderProductListAddParamList[index];
      // item.fdProductLineName = v.fdProductLineName;
      // item.fdProductLineCode = v.fdProductLineCode;
      item.fdProductCode = v.fdProductSku;
      item.fdProductName = v.text;
      item.fdWarehouseCode = '';
      item.fdWarehouseName = '';
      item.fdAvailableStock = 0;
      item.fdCurrentSupplyPrice = 0;
      item.fdApplySupplyPrice = 0;

      if (item.fdProductCode) {
        const price = await api.basedata
          .getProductPrice({
            productCodes: [item.fdProductCode],
          })
          .then((res) => (res || [])[0]);

        !!price && (item.fdCurrentSupplyPrice = price.productPrice);
      }
    },
    handleChangeMachineType(index, res) {
      const v = res[0] || {};

      const item = this.tempValue.orderProductListAddParamList[index];
      item.fdMachineType = v.value;
    },
    handleSelectWarehouse(index) {
      this.selectedIndex = index;

      if (this.needWarehouse && !this.selectedItem.fdProductCode) {
        this.$message.error('当前行数据未选择产品型号');
        return;
      }
      this.showWarehouse = true;
    },
    handleChangeWarehouse(res) {
      const v = res[0] || {};

      const item = this.tempValue.orderProductListAddParamList[this.selectedIndex];
      item.fdWarehouseCode = v.warehouseCode;
      item.fdWarehouseName = v.warehouseName;
      item.fdAvailableStock = v.stockCount;
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/scss/batch-drawer.scss';
</style>
