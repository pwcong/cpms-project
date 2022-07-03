<template>
  <block title="安装费" theme="primary">
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
            title: '是否TCL安装',
            dataIndex: 'fdIsTclInstall',
            customRender: (text, record) => (record.fdIsTclInstall === '1' ? '是' : '否'),
          },

          {
            title: '安装说明',
            dataIndex: 'fdInstallExplain',
          },
          {
            title: '客户需求表',
            dataIndex: 'demandSchedule',
            scopedSlots: { customRender: 'demandSchedule' },
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
      :data-source="tempValue.priceInstallListAddParams"
      :pagination="false"
      bordered
    >
      <template slot="demandSchedule" slot-scope="text, record">
        <uploader :value="record.sysAttContractAspectParams" readOnly />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEdit(record, index)">编辑</p-button-link>
        </span>
      </template>
    </p-table>

    <setting-install
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
import SettingInstall from './setting-install';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    priceInstallListAddParams: [],
  },
});

export default {
  name: 'install-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingInstall,
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
    handleOk() {
      this.tempValue.priceInstallListAddParams = [
        ...this.tempValue.priceInstallListAddParams,
      ];
      this.onOk();
    },
    handleEdit(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleChange(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.itemIndex > -1) {
        this.tempValue.priceInstallListAddParams[this.itemIndex] = value;
      } else {
        this.tempValue.priceInstallListAddParams.push(value);
      }

      this.handleOk();
    },
  },
};
</script>
