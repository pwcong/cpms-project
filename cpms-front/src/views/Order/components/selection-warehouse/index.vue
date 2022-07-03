<template>
  <p-modal
    :maskClosable="false"
    title="选择仓库"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="1" :model="query">
        <p-switch-form-item label=""></p-switch-form-item>
        <template slot="button">
          <p-button type="primary" @click="onRefresh(false)" icon="search" />
        </template>
      </p-switch-form>
    </div>
    <div>
      <p-table
        class="selection-warehouse"
        :locale="{
          emptyText: '暂无库存',
        }"
        style="margin-top: 8px"
        :scroll="{ x: true }"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: tempValue.map((d) => d.warehouseCode),
          onChange: onSelectChange,
        }"
        rowKey="warehouseCode"
        :loading="loading"
        :columns="[
          {
            title: '仓库名称',
            dataIndex: 'warehouseName',
          },
          {
            title: '仓库编号',
            dataIndex: 'warehouseCode',
          },
          {
            title: '可用库存',
            dataIndex: 'stockCount',
          },
        ]"
        :data-source="list"
        bordered
        :pagination="{
          current: currentNo,
          pageSize: currentSize,
          pageSizeOptions: ['10', '20', '30', '50'],
          total: list.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共有 ${total} 条数据`,
        }"
        @change="(currentNo = $event.current) && (currentSize = $event.pageSize)"
      >
      </p-table>
    </div>
    <span slot="footer">
      <div style="display: flex; justify-content: space-between">
        <span>
          <span v-if="!!selectedValue">
            已选择：{{ (selectedValue || {}).warehouseName }}
          </span>
        </span>
        <span>
          <p-button @click="onCancel">取 消</p-button>
          <p-button :disabled="!selectedValue" type="primary" @click="handleSubmit">
            确 定
          </p-button>
        </span>
      </div>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin, userMixin } from '@/mixins';

export const EMode = {
  default: 'default',
  rdc: 'rdc',
};

const listMixin = buildListMixin({
  properties: ['warehouseName'],
  relation: ['mode', 'productCode', 'countyCode', 'visible'],
  getData: (_, query) => {
    _.currentNo = 1;

    const { productCode, productLineCode, partyCode, countyCode, visible } = _;
    if (!productCode || !visible) {
      return Promise.resolve({
        data: [],
      });
    }

    if (_.mode === EMode.rdc) {
      if (!countyCode) {
        return Promise.resolve({
          data: [],
        });
      }
      return api.order.getSkuStockWithCounty(countyCode, productCode);
    } else {
      if (!productLineCode || !partyCode) {
        return Promise.resolve({
          data: [],
        });
      }
      return api.order.getSkuStockWithProductLine(
        productCode,
        productLineCode,
        _.user.uid,
        partyCode
      );
    }
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-warehouse',
  mixins: [selectionMixin, listMixin, userMixin],
  props: {
    productCode: {
      type: String,
    },
    productLineCode: {
      type: String,
    },
    // salesCode: {
    //   type: String,
    // },
    partyCode: {
      type: String,
    },
    countyCode: {
      type: String,
    },
  },
  computed: {
    selectedValue() {
      return this.tempValue[0];
    },
  },
  data() {
    return {
      currentNo: 1,
      currentSize: 10,
    };
  },
  methods: {
    handleSubmit() {
      this.onOk();
    },
    onSelectChange(selectedRowKeys) {
      this.tempValue = this.list.filter(
        (d) => selectedRowKeys.indexOf(d.warehouseCode) > -1
      );
    },
  },
};
</script>
