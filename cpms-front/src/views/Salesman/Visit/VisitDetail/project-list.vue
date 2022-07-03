<template>
  <block title="更新项目状态" theme="primary">
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
      ]"
      :data-source="tempValue.visitFeedbackListDtos"
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
    visitFeedbackListDtos: [],
  },
});

export default {
  name: 'project-list',
  mixins: [selectionMixin],
};
</script>
