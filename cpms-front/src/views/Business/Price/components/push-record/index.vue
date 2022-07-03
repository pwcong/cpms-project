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
          dataIndex: 'updateTime',
          customRender: (text, record, index) => formatDateTime(record.updateTime),
        },
        {
          title: '推送系统',
          dataIndex: 'fdSystemFlag',
          scopedSlots: { customRender: 'fdSystemFlag' },
        },
        {
          title: '推送状态',
          dataIndex: 'fdStatus',
          scopedSlots: { customRender: 'fdStatus' },
        },
        {
          title: '原始实体参数',
          dataIndex: 'fdRequestModel',
          scopedSlots: { customRender: 'fdRequestModel' },
        },
        {
          title: '请求参数',
          dataIndex: 'fdRequestParam',
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

      <template slot="fdRequestModel" slot-scope="text, record">
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
    <entity-parameter :fdRequestModel="fdRequestModel" :visible.sync="entityParameter" />
    <request-parameter
      :fdRequestParam="fdRequestParam"
      :visible.sync="requestParameter"
    />
    <error-info :fdResponseMsg="fdResponseMsg" :visible.sync="errorInfo" />
  </block>
</template>

<script>
import api from '@/api';
import EntityParameter from '../entity-parameter';
import RequestParameter from '../request-parameter';
import ErrorInfo from '../error-info';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdModuleId: _.moduleId,
    // fdModuleId: 'c7b787c9f7d3215e90fec318aa4ff4ff',
    // fdModuleId: 'cd3fbb17d4cea7c30c69ccf72c3ad858',
    fdModuleFlag: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdModuleId && !!query.fdModuleFlag
      ? api.common.getItfRecordList(query)
      : Promise.resolve({
          data: [],
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
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  components: {
    EntityParameter,
    RequestParameter,
    ErrorInfo,
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
    moduleFlag() {
      this.onRefresh();
    },
  },
  data() {
    return {
      fdRequestModel: '',
      fdRequestParam: '',
      fdResponseMsg: '',
      entityParameter: false,
      requestParameter: false,
      errorInfo: false,
    };
  },
  methods: {
    handleEntityParameter(record) {
      this.entityParameter = true;
      this.fdRequestModel = record.fdRequestModel;
    },
    handleRequestParameter(record) {
      this.requestParameter = true;
      this.fdRequestParam = record.fdRequestParam;
    },
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
