<template>
  <block title="拜访反馈记录" theme="primary">
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
          title: '实际拜访人姓名',
          dataIndex: 'fdVisitName',
        },
        {
          title: '实际拜访人电话',
          dataIndex: 'fdVisitMobile',
        },
        {
          title: '实际拜访人职务',
          dataIndex: 'fdVisitJob',
        },
        {
          title: '反馈内容',
          dataIndex: 'fdProjectFeedback',
        },
        {
          title: '图片',
          dataIndex: 'sysAttContractAspectParams',
          scopedSlots: { customRender: 'sysAttContractAspectParams' },
        },
      ]"
      :data-source="
        !!tempValue.spersonVisitFeedbackList ? [tempValue.spersonVisitFeedbackList] : []
      "
      bordered
    >
      <template slot="sysAttContractAspectParams" slot-scope="text, record">
        <uploader
          mode="picture"
          multiple
          read-only
          :value="record.sysAttContractAspectParams || []"
        />
      </template>
    </p-table>
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    spersonVisitFeedbackList: undefined,
  },
});

export default {
  name: 'feedback-list',
  mixins: [selectionMixin],
};
</script>
