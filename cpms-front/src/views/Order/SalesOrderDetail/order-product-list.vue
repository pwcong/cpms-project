<template>
  <block title="订单与产品信息" theme="primary" class="order-product-list">
    <template v-slot:action>
      <p-button
        type="primary"
        style="margin-left: 8px"
        v-if="!readOnly"
        @click="onRefresh"
      >
        刷新状态
      </p-button>
    </template>

    <!-- <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :loading="loading"
      :columns="[
        {
          title: '状态',
          dataIndex: 'fdStatus',
          scopedSlots: { customRender: 'fdStatus' },
        },
        {
          title: '方舟子单号',
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
          customRender: (v) => formatAmount(v),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 120,
          scopedSlots: { customRender: 'operation' },
        },
      ]"
      :data-source="list"
      :pagination="false"
      bordered
    >
      <template slot="fdStatus" slot-scope="text, record">
        <order-split-status-text :value="record.fdStatus" />
      </template>
      <template slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <product-list
          :crmCode="record.fdApplyCustomerCode"
          :value="{
            ...record,
            orderProductLists: record.orderProductLists || [],
            fdBillType: tempValue.fdBillType,
            fdSaleOfficeCode: tempValue.fdSaleOfficeCode,
          }"
          :moduleId="moduleId"
          @change="onRefresh"
          :readOnly="readOnly || !checkButton(record, 'editProduct')"
        />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <template v-if="!readOnly">
            <p-popconfirm
              title="是否确认撤回当前子单?"
              @confirm="handleRevertItem(record, index)"
              v-if="checkButton(record, 'withdraw')"
            >
              <p-button-link>撤回</p-button-link>
            </p-popconfirm>
            <p-popconfirm
              title="是否确认重新提交当前子单?"
              @confirm="handleSubmitItem(record, index)"
              v-if="checkButton(record, 'resubmit')"
            >
              <p-button-link> 重新提交 </p-button-link>
            </p-popconfirm>
            <p-popconfirm
              title="是否确认删除当前子单?"
              @confirm="handleDelItem(record, index)"
              v-if="checkButton(record, 'delete')"
            >
              <p-button-link>删除</p-button-link>
            </p-popconfirm>
          </template>
          <p-button-link
            @click="handleOrderDetail(record, index)"
            v-if="checkButton(record, 'viewdetails')"
          >
            查看详情
          </p-button-link>
          <p-button-link
            @click="handleOrderLog(record, index)"
            v-if="checkButton(record, 'viewlog')"
          >
            查看日志
          </p-button-link>
        </span>
      </template>
    </p-table> -->

    <p-spin :spinning="loading">
      <div class="order-product-wrapper" style="margin-top: 16px">
        <div class="order-product-item" v-for="(record, index) in list" :key="index">
          <table class="order-product-table">
            <tr class="order-product-table-head">
              <td width="160">
                <span class="order-product-table-title">状态</span>
                <span class="order-product-table-value">
                  <order-split-status-text :value="record.fdStatus" />
                </span>
              </td>
              <td width="150">
                <span class="order-product-table-title">方舟子单号</span>
                <span class="order-product-table-value">
                  {{ record.fdArkChildOrderNo || '&lt;无&gt;' }}
                </span>
              </td>
              <td>
                <span class="order-product-table-title">产品线</span>
                <span class="order-product-table-value">
                  {{ record.fdProductLineName || '&lt;无&gt;' }}
                </span>
              </td>
              <td>
                <span class="order-product-table-title">发货仓库</span>
                <span class="order-product-table-value">
                  {{ record.fdWarehouseName || '&lt;无&gt;' }}
                </span>
              </td>
              <td>
                <span class="order-product-table-title">合计数量</span>
                <span class="order-product-table-value">
                  {{ record.fdShipCount }}
                </span>
              </td>
              <td>
                <span class="order-product-table-title">合计金额</span>
                <span class="order-product-table-value">
                  {{ formatAmount(record.fdProductMoney) }}
                </span>
              </td>
              <td width="200" align="right">
                <span class="order-product-table-value">
                  <template v-if="!readOnly">
                    <p-popconfirm
                      title="是否确认撤回当前子单?"
                      @confirm="handleRevertItem(record, index)"
                      v-if="checkButton(record, 'withdraw')"
                    >
                      <p-button-link>撤回</p-button-link>
                    </p-popconfirm>
                    <p-popconfirm
                      title="是否确认重新提交当前子单?"
                      @confirm="handleSubmitItem(record, index)"
                      v-if="checkButton(record, 'resubmit')"
                    >
                      <p-button-link> 重新提交 </p-button-link>
                    </p-popconfirm>
                    <p-popconfirm
                      title="是否确认删除当前子单?"
                      @confirm="handleDelItem(record, index)"
                      v-if="checkButton(record, 'delete')"
                    >
                      <p-button-link>删除</p-button-link>
                    </p-popconfirm>
                  </template>
                  <p-button-link
                    @click="handleOrderDetail(record, index)"
                    v-if="checkButton(record, 'viewdetails')"
                  >
                    查看详情
                  </p-button-link>
                  <p-button-link
                    @click="handleOrderLog(record, index)"
                    v-if="checkButton(record, 'viewlog')"
                  >
                    查看日志
                  </p-button-link>
                </span>
              </td>
            </tr>
          </table>
          <product-list
            :scrollable="true"
            :crmCode="record.fdApplyCustomerCode"
            :value="{
              ...record,
              orderProductLists: record.orderProductLists || [],
              fdBillType: tempValue.fdBillType,
              fdSaleOfficeCode: tempValue.fdSaleOfficeCode,
            }"
            :moduleId="moduleId"
            @change="handleRefresh"
            :readOnly="readOnly || !checkButton(record, 'editProduct')"
          />
        </div>
      </div>
    </p-spin>

    <div class="order-product-counter">
      <span class="order-product-counter-val">
        合计数量：<span>{{ totalCount }}</span>
      </span>
      <span class="order-product-counter-val">
        合计金额：<span>{{ formatAmount(totalAmount) }}</span>
      </span>
    </div>

    <order-log
      :moduleId="itemValue.id"
      :moduleOrderId="itemValue.orderProductLists"
      :moduleNumber="itemValue.fdNumber"
      :visible.sync="orderLogVisible"
    />
    <order-detail :moduleId="itemValue.id" :visible.sync="orderDetailVisible" />
  </block>
</template>

<script>
import api from '@/api';

import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import OrderLog from '../components/order-log';
import OrderDetail from '../components/order-detail';
import ProductList from './product-list';

import { OrderSplitStatusText } from '../components/select/order-split-status';
import { refreshOrderList } from '../SalesOrderEdit/form';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

const reqMixin = buildListMixin({
  relation: ['moduleId'],
  getData: (_) => {
    const { moduleId } = _;

    if (!moduleId) {
      return Promise.resolve({
        data: [],
      });
    }

    return refreshOrderList(_, moduleId).then((data) => ({
      data: data || [],
    }));
  },
});

export default {
  name: 'order-product-list',
  mixins: [selectionMixin, reqMixin, formatMixin, commonMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    ProductList,
    OrderLog,
    OrderDetail,
    OrderSplitStatusText,
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
  computed: {
    totalCount() {
      return (this.list || []).reduce((p, c) => p + (c.fdShipCount || 0), 0);
    },
    totalAmount() {
      return (this.list || []).reduce((p, c) => p + (c.fdProductMoney || 0), 0);
    },
  },
  methods: {
    handleRefresh() {
      this.onOk();
      this.onRefresh();
    },
    async handleDelItem(item, index) {
      const remove = this.$message.loading('删除子单中', 0);
      try {
        await api.order.delOrderSplit(item.id);
        this.$message.success('子单删除成功');
        this.onRefresh();
      } finally {
        remove();
      }
    },
    async handleSubmitItem(item, index) {
      const remove = this.$message.loading('重新提交子单中', 0);

      try {
        await api.order.putResubmitOrderSplit(item);
        this.$message.success('子单重新提交成功');
        this.onRefresh();
      } finally {
        remove();
      }
    },
    async handleRevertItem(item, index) {
      const remove = this.$message.loading('撤回子单中', 0);

      try {
        await api.order.putWithdrawOrderSplit(item.id);
        this.$message.success('子单撤回成功');
        this.onRefresh();
      } finally {
        remove();
      }
    },
    handleOrderLog(record) {
      console.log('record', record);
      this.orderLogVisible = true;
      this.itemValue = record;
    },
    handleOrderDetail(record) {
      this.orderDetailVisible = true;
      this.itemValue = record;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.order-product {
  &-item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  &-table {
    width: 100%;
    max-width: 100%;

    &-head {
      background-color: rgba($theme-color, 0.08);
      td {
        padding: 4px 8px;
      }
    }

    &-title,
    &-value {
      display: block;
    }

    &-title {
      font-size: 12px;
      color: #999999;
    }

    &-value {
      font-size: 14px;
    }
  }

  &-counter {
    padding: 8px 0;
    color: #666666;
    font-size: 14px;
    &-val {
      margin-right: 16px;
    }
    &-val span {
      font-size: 16px;
      color: $theme-color;
    }
  }
}
</style>
