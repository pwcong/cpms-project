<template>
  <block class="product-list" title="产品信息" theme="primary">
    <template v-slot:title>
      <div>
        <span>产品信息</span>
        <span style="font-size: 12px; color: #e50113">
          （注：产品信息至少一条记录）
        </span>
      </div>
    </template>
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增产品信息
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      :columns="
        [
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
          },
          {
            title: '产品类型',
            dataIndex: 'fdProductCategoryName',
          },
          {
            title: '产品型号',
            dataIndex: 'fdProductName',
          },
          {
            title: '产品编码',
            dataIndex: 'fdProductId',
          },
          {
            title: '数量',
            dataIndex: 'fdNum',
          },
          {
            title: '预计销售单价(元)',
            dataIndex: 'fdPrice',
            customRender: (text, recode) => formatAmount(text),
          },
          {
            title: '预售总金额(元)',
            dataIndex: 'fdTotalSum',
            customRender: (text, recode) => formatAmount(text),
          },
          {
            title: '预出货日期',
            dataIndex: 'fdShippingDate',
            customRender: (text, recode) => formatDate(recode.fdShippingDate),
          },
          {
            title: '备注/定制说明',
            dataIndex: 'fdRemake',
          },
          {
            title: '定制费承担方',
            dataIndex: 'fdCustomFeeBearer',
          },
          {
            title: '是否有效',
            dataIndex: 'fdIsValid',
            customRender: (text, record, index) =>
              record.fdIsValid === '0' ? '否' : '是',
          },
        ].concat(
          !!readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  fixed: 'right',
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="tempValue.productListParams"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link
            v-if="!record.id || tempValue.fdProjectStatus === 'draft'"
            @click="handleEditItem(record, index)"
          >
            编辑
          </p-button-link>
          <p-popconfirm
            v-if="!record.id || tempValue.fdProjectStatus === 'draft'"
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link> 删除 </p-button-link>
          </p-popconfirm>
          <template v-else>
            <p-popconfirm
              v-if="record.fdIsValid !== '0'"
              title="是否确认废弃当前行数据?"
              @confirm="handleAbandonItem(record, index)"
            >
              <p-button-link>废弃</p-button-link>
            </p-popconfirm>
          </template>
        </span>
      </template>
    </p-table>

    <setting-product
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingProduct from './setting-product';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    productListParams: [],
  },
});

export default {
  name: 'product-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingProduct,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleAddItem() {
      this.handleEditItem({}, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleOk() {
      this.tempValue.productListParams = [...this.tempValue.productListParams];
      this.onOk();
    },
    async handleAbandonItem(value, index) {
      this.tempValue.productListParams[index] = {
        ...value,
        fdIsValid: '0',
        fdIsUpdate: '1',
      };
      this.handleOk();
    },
    handleDelItem(value, index) {
      this.tempValue.productListParams.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑产品，否则是新增产品
      if (this.itemIndex > -1) {
        this.tempValue.productListParams[this.itemIndex] = value;
      } else {
        this.tempValue.productListParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.product-list {
  .tips {
    color: $theme-color;
  }
}
</style>
