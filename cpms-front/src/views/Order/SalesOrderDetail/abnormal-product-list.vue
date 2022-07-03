<template>
  <p-modal
    :maskClosable="false"
    title="异常产品单"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <p-table
      :scroll="{ x: true }"
      :loading="loading"
      :columns="
        [
          {
            title: '状态',
            dataIndex: 'fdStatus',
            scopedSlots: { customRender: 'fdStatus' },
          },
          {
            title: '方舟编号',
            dataIndex: 'fdArkChildOrderNo',
          },
          {
            title: '产品线',
            dataIndex: 'fdProductLineName',
          },
          {
            title: '发货仓库',
            dataIndex: 'fdWarehouseName',
          },
          {
            title: '合计数量',
            dataIndex: 'fdShipCount',
          },
          {
            title: '合计金额',
            dataIndex: 'fdProductMoney',
          },
        ].concat(
          !!readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="list"
      :pagination="false"
      bordered
    >
      <template slot="fdStatus" slot-scope="text, record">
        <order-split-status-text :value="record.fdStatus" />
      </template>
      <template slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <product-list readOnly :value="record" :moduleId="moduleId" />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleOrderDetail(record, index)">
            查看详情
          </p-button-link>
          <p-button-link @click="handleOrderLog(record, index)"> 查看日志 </p-button-link>
        </span>
      </template>
    </p-table>

    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button :disabled="list.length <= 0" type="primary" @click="handleRevert">
        撤回修改
      </p-button>
    </span>

    <order-log :moduleNumber="itemValue.fdNumber" :visible.sync="orderLogVisible" />
    <order-detail :moduleId="itemValue.id" :visible.sync="orderDetailVisible" />
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';
import { OrderSplitStatusText } from '../components/select/order-split-status';
import OrderLog from '../components/order-log';
import OrderDetail from '../components/order-detail';
import ProductList from './product-list';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

const listMixin = buildListMixin({
  relation: ['moduleId', 'visible'],
  getData: (_, query) => {
    const { moduleId, visible } = _;

    if (!moduleId || !visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getErrorOrderSplitList(moduleId).then((data) => ({
      data,
    }));
  },
});

export default {
  name: 'abnormal-product-list',
  mixins: [selectionMixin, listMixin],
  components: {
    OrderSplitStatusText,
    OrderLog,
    OrderDetail,
    ProductList,
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      orderDetailVisible: false,
      orderLogVisible: false,
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleRevert() {
      this.$confirm({
        title: '是否确认撤回子单?',
        onOk: async () => {
          for (let i = 0, l = this.list.length; i < l; i++) {
            const item = this.list[i];
            await api.order.putWithdrawOrderSplit(item.id);
          }
          this.$message.success('子单撤回成功');
          this.onOk();
        },
        onCancel: () => {},
      });
    },
    handleOrderLog(record) {
      this.itemValue = record;
      this.orderLogVisible = true;
    },
    handleOrderDetail(record) {
      this.itemValue = record;
      this.orderDetailVisible = true;
    },
  },
};
</script>
