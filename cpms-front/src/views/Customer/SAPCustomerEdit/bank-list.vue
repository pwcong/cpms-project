<template>
  <block title="银行账户信息" theme="primary">
    <template v-slot:action>
      <p-button
        style="margin-left: 8px"
        type="primary"
        v-if="!readOnly"
        @click="handleAddItem"
        :disabled="tempValue.custSapBankListAddParamList.length >= 1"
      >
        新增银行账户
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      :rowKey="
        (row, index) => {
          return index;
        }
      "
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
            title: '银行国家/地区',
            dataIndex: 'fdBankCountry',
          },
          {
            title: '银行账号',
            dataIndex: 'fdBankAccount',
          },
          {
            title: '开户行详细名称',
            dataIndex: 'fdBankAccName',
          },
          {
            title: '是否为专用发票',
            dataIndex: 'fdIsVat',
            scopedSlots: { customRender: 'fdIsVat' },
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
      :data-source="tempValue.custSapBankListAddParamList"
      bordered
    >
      <template slot="fdIsVat" slot-scope="text">
        <dict-text
          :value="(text || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_sap_is_vat"
        />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link
            v-if="
              !record.id ||
              tempValue.fdSapStatus === 'draft' ||
              tempValue.fdSapStatus === 'reject'
            "
            @click="handleEditItem(record, index)"
          >
            编辑
          </p-button-link>
          <p-popconfirm
            v-if="
              !record.id ||
              tempValue.fdSapStatus === 'draft' ||
              tempValue.fdSapStatus === 'reject'
            "
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>
    <setting-bank
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingBank from './setting-bank';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custSapBankListAddParamList: [],
  },
});

export default {
  name: 'bank-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingBank,
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
      this.handleEditItem(
        {
          fdIsValid: '1',
        },
        -1
      );
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleOk() {
      this.tempValue.custSapBankListAddParamList = [
        ...this.tempValue.custSapBankListAddParamList,
      ];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.custSapBankListAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.custSapBankListAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.custSapBankListAddParamList.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
