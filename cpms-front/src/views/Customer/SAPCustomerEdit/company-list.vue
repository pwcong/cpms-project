<template>
  <block title="公司代码视图" theme="primary">
    <template v-slot:action>
      <p-button
        style="margin-left: 8px"
        type="primary"
        v-if="!readOnly"
        @click="handleAddItem"
      >
        新增公司代码视图
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
            title: '公司代码',
            dataIndex: 'fdCompanySapCode',
          },
          {
            title: '统御科目',
            dataIndex: 'fdAccount',
          },
          {
            title: '自动清账标识',
            dataIndex: 'fdClearAccount',
            scopedSlots: { customRender: 'fdClearAccount' },
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
      :data-source="tempValue.custSapCompanyListAddParamList"
      bordered
    >
      <template slot="fdClearAccount" slot-scope="text">
        <dict-text
          :value="(text || '').split(',')"
          systemCode="cpms"
          dictCode="cpms_sap_clear_account"
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
    <setting-company
      :sapCustName="tempValue.fdSapCustName"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingCompany from './setting-company';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custSapCompanyListAddParamList: [],
  },
});

export default {
  name: 'company-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingCompany,
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
      this.tempValue.custSapCompanyListAddParamList = [
        ...this.tempValue.custSapCompanyListAddParamList,
      ];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.custSapCompanyListAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.custSapCompanyListAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.custSapCompanyListAddParamList.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
