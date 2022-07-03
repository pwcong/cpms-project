<template>
  <block title="销售视图" theme="primary">
    <template v-slot:action>
      <p-button
        style="margin-left: 8px"
        type="primary"
        v-if="!readOnly"
        @click="handleAddItem"
      >
        新增销售视图
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
            title: '销售组织',
            dataIndex: 'fdSalesOrganization',
          },
          {
            title: '经营部-销售办公室',
            dataIndex: 'fdSalesOffice',
          },
          {
            title: '客户组-市场级别',
            dataIndex: 'fdMarketLevel',
          },
          {
            title: '一级渠道',
            dataIndex: 'fdChannelOneName',
          },
          {
            title: '二级渠道',
            dataIndex: 'fdChannelTwoName',
          },
          {
            title: '三级渠道',
            dataIndex: 'fdChannelThreeName',
          },
          {
            title: '业务员ZB',
            dataIndex: 'fdSalesMan',
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
      :data-source="tempValue.custSapSaleListAddParamList"
      bordered
    >
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
    <setting-sales
      :moduleId="moduleId"
      :value="itemValue"
      :custSapCompanyListAddParamList="tempValue.custSapCompanyListAddParamList"
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
    custSapSaleListAddParamList: [],
  },
});

export default {
  name: 'sales-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
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
      this.tempValue.custSapSaleListAddParamList = [
        ...this.tempValue.custSapSaleListAddParamList,
      ];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.custSapSaleListAddParamList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.custSapSaleListAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.custSapSaleListAddParamList.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
