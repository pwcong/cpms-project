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
            dataIndex: 'sysAttContractAspectParams',
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
      :data-source="tempValue.contractInstallAddParamLists"
      :pagination="false"
      bordered
    >
      <template slot="demandSchedule" slot-scope="text, record">
        <uploader readOnly :value="record.sysAttContractAspectParams" />
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
    contractInstallAddParamLists: [],
  },
});

export default {
  name: 'install-cost',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingInstall,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleEdit(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleOk() {
      this.tempValue.contractInstallAddParamLists = [
        ...this.tempValue.contractInstallAddParamLists,
      ];
      this.onOk();
    },
    handleChange(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.itemIndex > -1) {
        this.tempValue.contractInstallAddParamLists[this.itemIndex] = value;
      } else {
        this.tempValue.contractInstallAddParamLists.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
