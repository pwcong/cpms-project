<template>
  <block title="下周计划" theme="primary">
    <template v-slot:action v-if="!readOnly">
      <p-button type="primary" @click="handleAddItem"> 新增计划 </p-button>
    </template>

    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :pagination="false"
      :columns="
        [
          {
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left',
            customRender: (text, record, index) => `${index + 1}`,
          },
          {
            title: '拜访类型',
            dataIndex: 'fdVisitType',
            scopedSlots: { customRender: 'fdVisitType' },
          },
          {
            title: '拜访方式',
            dataIndex: 'fdVisitWay',
            scopedSlots: { customRender: 'fdVisitWay' },
          },
          {
            title: '客户/项目/线索名称',
            dataIndex: 'fdModuleType',
          },
          {
            title: '拜访人姓名',
            dataIndex: 'fdVisitName',
          },
          {
            title: '拜访人职务',
            dataIndex: 'fdVisitJob',
          },
          {
            title: '拜访人电话',
            dataIndex: 'fdVisitMobile',
          },
          {
            title: '拜访目的',
            dataIndex: 'fdVisitPurpose',
          },
          {
            title: '拜访地址',
            dataIndex: 'fdVisitAddress',
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
      :data-source="tempValue.visitList"
      bordered
    >
      <template slot="fdVisitType" slot-scope="text, record">
        <dict-text
          dictCode="cpms_visit_type"
          systemCode="cpms"
          :value="(record.fdVisitType || '').split(',')"
        />
      </template>
      <template slot="fdVisitWay" slot-scope="text, record">
        <dict-text
          dictCode="cpms_visit_way"
          systemCode="cpms"
          :value="(record.fdVisitWay || '').split(',')"
        />
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span v-if="!record.id">
          <p-button-link @click="handleEditItem(record, index)"> 编辑 </p-button-link>
          <p-popconfirm
            title="是否确认删除该数据?"
            @confirm="handleDelItem(record, index)"
          >
            <p-button-link>删除</p-button-link>
          </p-popconfirm>
        </span>
      </template>
    </p-table>

    <setting-visit
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingVisit from './setting-visit';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    visitList: [],
  },
});

export default {
  name: 'visit-list',
  mixins: [selectionMixin],
  components: {
    SettingVisit,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleOk() {
      this.tempValue.visitList = [...this.tempValue.visitList];
      this.onOk();
    },
    handleAddItem() {
      this.handleEditItem({}, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleDelItem(value, index) {
      this.tempValue.visitList.splice(index, 1);
      this.handleOk();
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.visitList[this.itemIndex] = value;
      } else {
        this.tempValue.visitList.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
