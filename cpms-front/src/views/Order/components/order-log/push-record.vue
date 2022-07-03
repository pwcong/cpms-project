<template>
  <block title="推送记录" theme="primary">
    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="fdId"
      :loading="loading"
      :columns="[
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '推送时间',
          dataIndex: 'pushTime',
          customRender: (text, record, index) => formatDateTime(record.pushTime),
        },
        {
          title: '推送系统',
          dataIndex: 'pushSystem',
          scopedSlots: { customRender: 'fdSystemFlag' },
        },
        {
          title: '推送状态',
          dataIndex: 'pushStatus',
          scopedSlots: { customRender: 'fdStatus' },
        },
        {
          title: '描述',
          dataIndex: 'operationlog',
        },
      ]"
      :data-source="list"
      bordered
      :pagination="{
        current: currentNo,
        pageSize: currentSize,
        total: list.length,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(currentNo = $event.current) && (currentSize = $event.pageSize)"
    >
      <template slot="fdSystemFlag" slot-scope="text">
        {{ text | fdSystemFlag }}
      </template>

      <template slot="fdStatus" slot-scope="text, record">
        <span style="margin-right: 8px">
          {{ text | fdStatus }}
        </span>
        <span v-if="record.fdStatus === 'fail'">
          <p-button-link @click="handleErrorInfo(record)">查看错误信息</p-button-link>
        </span>
      </template>
    </p-table>
    <error-info :fdResponseMsg="fdResponseMsg" :visible.sync="errorInfo" />
  </block>
</template>

<script>
import api from '@/api';
import ErrorInfo from '@/views/Business/Price/components/error-info';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

const listMixin = buildListMixin({
  relation: ['moduleNumber', 'visible'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.moduleNumber || !_.visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order.getOrderFindPushLog(_.moduleNumber, 'push').then((data) => {
      return {
        data: data.map((d, i) => ({
          ...d,
          id: i,
        })),
      };
    });
  },
});

export function fdSystemFlag(value) {
  switch (value) {
    case 'crm':
      return 'CRM系统';
    case 'ark':
      return '方舟系统';
    case 'cost':
      return '费控系统';
    default:
      return value;
  }
}

export function fdStatus(v) {
  switch (v) {
    case 'init':
      return '初始化';
    case 'success':
      return '推送成功';
    case 'fail':
      return '推送异常';
    case 'close':
      return '关闭不推送';
    default:
      return v;
  }
}

export default {
  name: 'push-record',
  props: {
    visible: {
      type: Object,
    },
    moduleNumber: String,
  },
  mixins: [listMixin, formatMixin, selectionMixin],
  components: {
    ErrorInfo,
  },
  data() {
    return {
      currentNo: 1,
      currentSize: 10,
      fdResponseMsg: '',
      errorInfo: false,
    };
  },
  // updated() {
  //   console.log('BBB', this.moduleId);
  // },
  methods: {
    handleErrorInfo(record) {
      this.errorInfo = true;
      this.fdResponseMsg = record.fdResponseMsg;
    },
  },
  filters: {
    fdSystemFlag(value) {
      return fdSystemFlag(value);
    },
    fdStatus(v) {
      return fdStatus(v);
    },
  },
};
</script>
