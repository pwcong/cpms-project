<template>
  <block title="更新项目状态" theme="primary">
    <template v-slot:action>
      <p-button type="primary" @click="handleAddItem"> 新增项目状态 </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="[
        {
          title: '序号',
          dataIndex: 'index',
          width: 50,
          fixed: 'left',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '项目名称',
          dataIndex: 'fdProjectName',
        },
        {
          title: '反馈内容',
          dataIndex: 'fdProjectFeedback',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' },
        },
      ]"
      :data-source="tempValue.custList"
      bordered
    >
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-popconfirm
            title="是否确认删除该数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link> 删除 </p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <setting-project
      :customerId="tempValue.fdModuleTypeId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingProject from './setting-project';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custList: [],
  },
});

export default {
  name: 'project-list',
  mixins: [selectionMixin],
  components: {
    SettingProject,
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
      this.handleEditItem({}, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleOk() {
      this.tempValue.custList = [...this.tempValue.custList];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.custList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑产品，否则是新增产品
      if (this.itemIndex > -1) {
        this.tempValue.custList[this.itemIndex] = value;
      } else {
        this.tempValue.custList.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
