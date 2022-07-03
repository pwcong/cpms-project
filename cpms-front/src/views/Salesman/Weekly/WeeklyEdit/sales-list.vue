<template>
  <block title="本周销售任务达成" theme="primary">
    <template v-slot:action v-if="!readOnly">
      <p-button type="primary" @click="handleAddItem"> 新增数据 </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      :columns="
        [
          {
            title: '月份',
            dataIndex: 'fdMonth',
          },
          {
            title: '商务中心',
            dataIndex: 'fdBusinessCenterName',
          },
          {
            title: '产品线',
            dataIndex: 'fdProductLineName',
          },
          {
            title: '销售任务（万）',
            dataIndex: 'fdSalesTask',
          },
          {
            title: '实际收入（万）',
            dataIndex: 'fdRealizedIncome',
          },
          {
            title: '完成率',
            dataIndex: 'fdPercentageComplete',
            customRender: (text, record) => `${record.fdPercentageComplete || '--'}%`,
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
      :data-source="tempValue.salesLists"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-popconfirm
            title="是否确认删除该数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <setting-sales
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSales from './setting-sales';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    salesLists: [],
  },
});

export default {
  name: 'sales-list',
  mixins: [selectionMixin],
  components: {
    SettingSales,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleOk() {
      this.tempValue.salesLists = [...this.tempValue.salesLists];
      this.onOk();
    },
    handleAddItem() {
      this.handleEditItem({}, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleDelItem(value, index) {
      this.tempValue.salesLists.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.salesLists[this.itemIndex] = value;
      } else {
        this.tempValue.salesLists.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
