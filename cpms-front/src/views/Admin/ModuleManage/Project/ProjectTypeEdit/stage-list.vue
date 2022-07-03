<template>
  <block class="stage-list" title="阶段信息" theme="primary">
    <template v-slot:title>
      <div>
        <span>阶段信息</span>
        <span style="font-size: 12px; color: #e50113">
          （注：阶段信息至少一条记录）
        </span>
      </div>
    </template>

    <template v-slot:action>
      <p-button type="primary" v-if="!readOnly" @click="handleAddItem">
        新增阶段信息
      </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      row-key="fdProjectStageId"
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
            title: '项目阶段',
            dataIndex: 'fdName',
          },
          {
            title: '完成比例',
            dataIndex: 'fdPercent',
            customRender: (text, record) => `${record.fdPercent || '--'}%`,
          },
          ,
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
      :data-source="tempValue.typeStageConfigAddParams"
      bordered
    >
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
            v-if="index !== tempValue.typeStageConfigAddParams.length - 1"
          >
            下移
          </p-button-link>
        </span>
      </template>
    </p-table>

    <setting-stage
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingStage from './setting-stage';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    typeStageConfigAddParams: [],
  },
});

export default {
  name: 'stage-list',
  mixins: [selectionMixin],
  components: {
    SettingStage,
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
    handleDelItem(value, index) {
      this.tempValue.typeStageConfigAddParams.splice(index, 1);
      this.handleOk();
    },
    handleOk() {
      this.tempValue.typeStageConfigAddParams = [
        ...this.tempValue.typeStageConfigAddParams,
      ].map((d, i) => ({
        ...d,
        fdIsValid: '1',
        fdSortNum: i + 1,
      }));
      this.onOk();
    },
    handleMove(record, index, direction) {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      const t = this.tempValue.typeStageConfigAddParams[index];

      this.tempValue.typeStageConfigAddParams[index] =
        this.tempValue.typeStageConfigAddParams[targetIndex];
      this.tempValue.typeStageConfigAddParams[targetIndex] = t;

      this.handleOk();
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.typeStageConfigAddParams[this.itemIndex] = value;
      } else {
        this.tempValue.typeStageConfigAddParams.push(value);
      }

      this.handleOk();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.stage-list {
  .tips {
    color: $theme-color;
  }
}
</style>
