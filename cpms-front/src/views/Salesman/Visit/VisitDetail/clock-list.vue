<template>
  <block title="打卡记录" theme="primary">
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
          title: '姓名',
          dataIndex: 'fdUserName',
        },
        {
          title: '打卡地点',
          dataIndex: 'fdClockAddress',
        },
        {
          title: '打卡日期',
          dataIndex: 'date',
          customRender: (text, record) => formatDate(record.fdClockTime),
        },
        {
          title: '打卡时间',
          dataIndex: 'time',
          customRender: (text, record) => formatTime(record.fdClockTime),
        },
        {
          title: '图片',
          dataIndex: 'sysAttContractAspectParams',
          scopedSlots: { customRender: 'sysAttContractAspectParams' },
        },
      ]"
      :data-source="tempValue.clockRecordMainDtos"
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
import dayjs from 'dayjs';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    clockRecordMainDtos: [],
  },
});

export default {
  name: 'clock-list',
  mixins: [selectionMixin],
  methods: {
    formatDate(v) {
      if (!v) {
        return '';
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD');
    },
    formatTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(new Date(v)).format('HH:mm:ss');
    },
  },
};
</script>
