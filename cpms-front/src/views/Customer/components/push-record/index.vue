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
          dataIndex: 'createTime',
          customRender: (text, record, index) => formatDateTime(record.createTime),
        },
        {
          title: '推送系统',
          customRender: (text, record, index) => '财务共享系统',
        },
        {
          title: '推送状态',
          dataIndex: 'fdStatus',
          scopedSlots: { customRender: 'fdStatus' },
        },
        {
          title: '原始实体参数',
          dataIndex: 'fdEntityParam',
          scopedSlots: { customRender: 'fdEntityParam' },
        },
        {
          title: '请求参数',
          dataIndex: 'fdParam',
          scopedSlots: { customRender: 'requestParameter' },
        },
      ]"
      :data-source="list"
      bordered
      :pagination="{
        current: pageNo,
        pageSize: pageSize,
        total: totalSize,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(pageNo = $event.current) && (pageSize = $event.pageSize)"
    >
      <template slot="fdStatus" slot-scope="text, record">
        <span style="margin-right: 8px">
          {{ text | fdStatus }}
        </span>
        <span v-if="record.fdStatus === 'fail'">
          <p-button-link @click="handleErrorInfo(record)">查看错误信息</p-button-link>
        </span>
      </template>

      <template slot="fdEntityParam" slot-scope="text, record">
        <span>
          <p-button-link @click="handleEntityParameter(record)"
            >查看详情参数</p-button-link
          >
        </span>
      </template>
      <template slot="requestParameter" slot-scope="text, record">
        <span>
          <p-button-link @click="handleRequestParameter(record)"
            >查看详情参数</p-button-link
          >
        </span>
      </template>
    </p-table>

    <entity-parameter :fdEntityParam="fdEntityParam" :visible.sync="entityParameter" />
    <!-- 详情参数 -->
    <request-parameter :fdParam="fdParam" :visible.sync="requestParameter" />
    <error-info :fdRetMsg="fdRetMsg" :visible.sync="errorInfo" />
  </block>
</template>

<script>
import api from '@/api';
import EntityParameter from '../entity-parameter';
import RequestParameter from '../request-parameter';
import ErrorInfo from '../error-info';

import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: Object,
  defaultValue: {},
});

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
    moduleId: String,
  },
  mixins: [selectionMixin, formatMixin],
  components: {
    EntityParameter,
    RequestParameter,
    ErrorInfo,
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
  data() {
    return {
      fdEntityParam: '',
      fdParam: '',
      fdRetMsg: '',
      entityParameter: false,
      requestParameter: false,
      errorInfo: false,
      list: [],
    };
  },
  async created() {
    const list = await api.customer.getPushRecord(this.moduleId);
    this.list = list;
  },
  methods: {
    handleEntityParameter(record) {
      this.entityParameter = true;
      this.fdEntityParam = record.fdEntityParam;
    },
    handleRequestParameter(record) {
      this.requestParameter = true;
      this.fdParam = record.fdParam;
    },
    handleErrorInfo(record) {
      this.errorInfo = true;
      this.fdRetMsg = record.fdRetMsg;
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
