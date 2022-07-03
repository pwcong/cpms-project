<template>
  <block title="项目干系人" theme="primary">
    <template v-slot:title>
      <div>
        <span>项目干系人</span>
        <span style="font-size: 12px; color: #e50113">
          （注：项目干系人至少一条记录）
        </span>
      </div>
    </template>

    <template v-slot:action>
      <!-- <p-button type="primary" v-if="!readOnly" @click="showBatch = true">
        批量设置
      </p-button> -->
      <p-button
        style="margin-left: 8px"
        type="primary"
        v-if="!readOnly"
        @click="handleAddItem"
      >
        新增项目干系人
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
            title: '人员归属',
            dataIndex: 'fdPersonnelAttribution',
          },
          {
            title: '姓名',
            dataIndex: 'fdName',
          },
          {
            title: '电话',
            dataIndex: 'fdMobile',
          },
          {
            title: '职务',
            dataIndex: 'fdPosition',
          },
          {
            title: '上级领导',
            dataIndex: 'fdSuperiors',
          },
          {
            title: '参与角色',
            dataIndex: 'fdRole',
          },
          {
            title: '立场',
            dataIndex: 'fdStandpoint',
          },
          {
            title: '接触状态',
            dataIndex: 'fdContactStatus',
          },
          {
            title: '客情关系',
            dataIndex: 'fdGuestRelationship',
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
      :data-source="tempValue.stakeholderListParams"
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

    <setting-party
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />

    <!-- <batch-party
      :moduleId="moduleId"
      :value="tempValue"
      :visible.sync="showBatch"
      @change="(tempValue = $event) && handleOk()"
    /> -->
  </block>
</template>

<script>
// import api from "@/api";
import { buildSelectionMixin } from '@/mixins';
import SettingParty from './setting-party';
// import BatchParty from "./batch-party";

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    stakeholderListParams: [],
  },
});

export default {
  name: 'party-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingParty,
    // BatchParty,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
      showBatch: false,
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
      this.tempValue.stakeholderListParams = [...this.tempValue.stakeholderListParams];
      this.onOk();
    },
    handleDelItem(value, index) {
      this.tempValue.stakeholderListParams.splice(index, 1);
      this.handleOk();
    },
    async handleAbandonItem(value, index) {
      // await api.business.putProjectStakeholderInvalid(value.id);
      this.tempValue.stakeholderListParams[index] = {
        ...value,
        fdIsValid: '0',
        fdIsUpdate: '1',
      };
      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.stakeholderListParams[this.itemIndex] = value;
      } else {
        this.tempValue.stakeholderListParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
