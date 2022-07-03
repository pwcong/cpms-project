<template>
  <block title="项目地址" theme="primary">
    <template v-slot:title>
      <div>
        <span>项目地址</span>
        <span style="font-size: 12px; color: #e50113">
          （注：项目地址至少一条记录。如不选择项目地址，则在项目审批完成前，不能进行项目拜访）
        </span>
      </div>
    </template>
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增项目地址
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
            title: '项目施工地址',
            dataIndex: 'fdDetailAddress',
          },
          {
            title: '是否有效',
            dataIndex: 'fdIsValid',
            scopedSlots: { customRender: 'fdIsValid' },
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
      :data-source="tempValue.addressListParams"
      bordered
    >
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '0' ? '否' : '是' }}
      </template>
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
            <p-button-link>删除</p-button-link>
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

    <setting-address
      :list="tempValue.addressListParams"
      :index="itemIndex"
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
import SettingAddress from './setting-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressListParams: [],
  },
});

export default {
  name: 'address-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingAddress,
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
      this.tempValue.addressListParams = [...this.tempValue.addressListParams];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.addressListParams.splice(index, 1);
      this.handleOk();
    },
    async handleAbandonItem(value, index) {
      // await api.business.putProjectAddressInvalid(value.id);
      this.tempValue.addressListParams[index] = {
        ...value,
        fdIsValid: '0',
        fdIsUpdate: '1',
      };
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.addressListParams[this.itemIndex] = value;
      } else {
        this.tempValue.addressListParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
