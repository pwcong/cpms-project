<template>
  <block title="其他联系人" theme="primary">
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增联系人
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
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
            title: '姓名',
            dataIndex: 'fdContactName',
          },
          {
            title: '手机号',
            dataIndex: 'fdContactPhone',
          },
          {
            title: '是否有效',
            width: 200,
            dataIndex: 'fdIsValid',
            scopedSlots: { customRender: 'fdIsValid' },
            customRender: (text, record) => (record.fdIsValid === '0' ? '否' : '是'),
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
      :data-source="tempValue.otherContactsList"
      :pagination="false"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link
            v-if="!record.id || tempValue.fdClueStatus === 'draft'"
            @click="handleEditItem(record, index)"
          >
            编辑
          </p-button-link>
          <template v-if="!record.id || tempValue.fdClueStatus === 'draft'">
            <p-popconfirm
              title="是否确认删除当前行数据?"
              @confirm="handleDelItem(record, index)"
            >
              <p-button-link> 删除 </p-button-link>
            </p-popconfirm>
          </template>
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

    <setting-contact
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
import SettingContact from './setting-contact';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    otherContactsList: [],
  },
});

export default {
  name: 'contact-list',
  mixins: [selectionMixin],
  components: {
    SettingContact,
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
    handleAddItem() {
      this.handleEditItem({ fdIsValid: '1' }, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleOk() {
      this.tempValue.otherContactsList = [...this.tempValue.otherContactsList];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.otherContactsList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑产品，否则是新增产品
      if (this.itemIndex > -1) {
        this.tempValue.otherContactsList[this.itemIndex] = value;
      } else {
        this.tempValue.otherContactsList.push(value);
      }
      this.handleOk();
    },
    async handleAbandonItem(value, index) {
      this.tempValue.otherContactsList[index] = {
        ...value,
        fdIsValid: '0',
      };
      this.handleOk();
    },
  },
};
</script>
