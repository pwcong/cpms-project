<template>
  <block title="审批意见" theme="primary">
    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="[
        {
          title: '审批时间',
          dataIndex: 'time',
        },
        {
          title: '审批人',
          dataIndex: 'name',
        },
        {
          title: '执行操作',
          dataIndex: 'run',
        },
        {
          title: '审批意见',
          dataIndex: 'example',
        },
      ]"
      :data-source="tempValue.visitList"
      bordered
    >
    </p-table>
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    visitList: [],
  },
});

export default {
  name: 'outclock-list',
  mixins: [selectionMixin],
};
</script>
