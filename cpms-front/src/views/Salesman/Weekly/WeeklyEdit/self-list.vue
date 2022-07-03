<template>
  <block title="本周个人销售达成" theme="primary">
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
            title: '产品线',
            dataIndex: 'fdProductLineName',
          },
          {
            title: '实际收入（万）',
            dataIndex: 'fdRealizedIncome',
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
      :data-source="tempValue.selfLists"
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

    <setting-self
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSelf from './setting-self';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    selfLists: [],
  },
});

export default {
  name: 'self-list',
  mixins: [selectionMixin],
  components: {
    SettingSelf,
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
      this.tempValue.selfLists = [...this.tempValue.selfLists];
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
      this.tempValue.selfLists.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.selfLists[this.itemIndex] = value;
      } else {
        this.tempValue.selfLists.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
