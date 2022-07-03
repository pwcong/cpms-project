<template>
  <block title="组件信息" theme="primary">
    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增组件信息
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      row-key="fdComponentConfigId"
      :columns="
        [
          {
            title: '排序号',
            width: 50,
            fixed: 'left',
            dataIndex: 'fdSortNum',
          },
          {
            title: '项目组件',
            dataIndex: 'componentName',
          },
          {
            title: '组件ID',
            dataIndex: 'fdComponentId',
          },
          {
            title: '组件类型',
            dataIndex: 'fdComponentTypeName',
          },
          {
            title: '组件名称',
            dataIndex: 'fdComponentName',
          },
          {
            title: '组件输入提示',
            dataIndex: 'fdComponentInputPrompt',
          },
          {
            title: '组件其他提示',
            dataIndex: 'fdComponentOtherPrompt',
          },
          {
            title: '是否必填',
            dataIndex: 'fdIsRequired',
            scopedSlots: { customRender: 'fdIsRequired' },
          },
          {
            title: '是否有效',
            dataIndex: 'fdIsValid',
            scopedSlots: { customRender: 'fdIsValid' },
          },
        ].concat(
          !readOnly
            ? [
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: 120,
                  fixed: 'right',
                  scopedSlots: { customRender: 'operation' },
                },
              ]
            : []
        )
      "
      :data-source="tempValue.stageComponentConfigAddParams"
      bordered
    >
      <template slot="fdIsRequired" slot-scope="text, record">
        {{ record.fdIsRequired === '1' ? '是' : '否' }}
      </template>
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '1' ? '是' : '否' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-popconfirm
            title="是否确认删除当前行数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
          <p-button-link @click="handleMove(record, index, 'up')" v-if="index !== 0">
            上移
          </p-button-link>
          <p-button-link
            @click="handleMove(record, index, 'down')"
            v-if="index !== tempValue.stageComponentConfigAddParams.length - 1"
          >
            下移
          </p-button-link>
        </span>
      </template>
    </p-table>

    <setting-cmpt
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      :settingData="tempValue.stageComponentConfigAddParams"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingCmpt from './setting-cmpt';

import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    stageComponentConfigAddParams: [],
  },
});

export default {
  name: 'cmpt-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingCmpt,
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
          fdSortNum: 1,
          fdIsValid: '1',
          fdIsRequired: '0',
        },
        -1
      );
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    async handleDelItem(value, index) {
      try {
        // 若主表ID存在数据变更需请求接口
        if (!!this.moduleId) {
          await api.business.delProjectStageComponent(value.id);
        }

        this.tempValue.stageComponentConfigAddParams.splice(index, 1);

        this.handleOk();
      } catch (err) {
        console.error(err);
      }
    },
    handleOk() {
      this.tempValue.stageComponentConfigAddParams = [
        ...this.tempValue.stageComponentConfigAddParams,
      ].map((d, i) => ({
        ...d,
        fdIsValid: '1',
        fdSortNum: i + 1,
      }));
      this.onOk();
    },
    handleMove(record, index, direction) {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      const t = this.tempValue.stageComponentConfigAddParams[index];

      this.tempValue.stageComponentConfigAddParams[index] =
        this.tempValue.stageComponentConfigAddParams[targetIndex];
      this.tempValue.stageComponentConfigAddParams[targetIndex] = t;

      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.stageComponentConfigAddParams[this.itemIndex] = value;
      } else {
        this.tempValue.stageComponentConfigAddParams.push(value);
      }

      this.handleOk();
    },
  },
};
</script>
