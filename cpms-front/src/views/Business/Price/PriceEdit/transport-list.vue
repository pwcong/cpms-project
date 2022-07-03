<template>
  <block title="运输费" theme="primary">
    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="
        [
          {
            title: '费用承担方',
            dataIndex: 'fdCostBearName',
          },
          {
            title: '金额(元)',
            dataIndex: 'fdAmount',
            customRender: (text, recode) => formatAmount(text),
          },
          {
            title: '是否需要上楼',
            dataIndex: 'fdIsGoUpstairs',
            customRender: (text, record) => (record.fdIsGoUpstairs === '1' ? '是' : '否'),
          },
          {
            title: '楼层',
            dataIndex: 'fdFloor',
          },
          {
            title: '是否有电梯',
            dataIndex: 'fdIsElevator',
            customRender: (text, record) => (record.fdIsElevator === '1' ? '是' : '否'),
          },
          {
            title: '运输方式',
            dataIndex: 'fdTransportTypeName',
          },
          {
            title: '付费方式',
            dataIndex: 'fdPaymentTypeName',
          },
        ].concat(
          readOnly
            ? []
            : [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 100,
                  fixed: 'right',
                  scopedSlots: { customRender: 'operation' },
                },
              ]
        )
      "
      :data-source="tempValue.priceTransportListAddParams"
      :pagination="false"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEdit(record, index)">编辑</p-button-link>
        </span>
      </template>
    </p-table>

    <setting-transport
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChange"
    />
  </block>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingTransport from './setting-transport';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    priceTransportListAddParams: [],
  },
});

export default {
  name: 'transport-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingTransport,
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    // handleAdd() {
    //   this.handleEdit({}, -1);
    // },
    handleOk() {
      this.tempValue.priceTransportListAddParams = [
        ...this.tempValue.priceTransportListAddParams,
      ];
      this.onOk();
    },
    handleEdit(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    // handleDel(value, index) {
    //   this.tempValue.priceTransportListAddParams.splice(index, 1);
    //   this.handleOk();
    // },
    handleChange(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.itemIndex > -1) {
        this.tempValue.priceTransportListAddParams[this.itemIndex] = value;
      } else {
        this.tempValue.priceTransportListAddParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
