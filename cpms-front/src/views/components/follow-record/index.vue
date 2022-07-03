<template>
  <block title="跟进记录" theme="primary">
    <template #action>
      <p-button @click="handleAddItem" type="primary"> 新增跟进记录 </p-button>
    </template>

    <p-table
      style="margin-top: 16px"
      :scroll="{ x: true }"
      rowKey="createTime"
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
          title: '跟进人',
          dataIndex: 'fdUserName',
        },
        {
          title: '跟进人部门',
          dataIndex: 'fdDeptName',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          customRender: (text, record, index) => formatDateTime(record.createTime),
        },
        {
          title: '被拜访人',
          dataIndex: 'fdVisitName',
        },
        {
          title: '被拜访职务',
          dataIndex: 'fdVisitJob',
        },
        {
          title: '被拜访人电话',
          dataIndex: 'fdVisitMobile',
        },
        {
          title: '拜访地址',
          dataIndex: 'fdAddress',
        },
        {
          title: '跟进内容',
          dataIndex: 'fdProjectFeedback',
        },
        {
          title: '修改人',
          dataIndex: 'updateByName',
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
    </p-table>

    <setting-follow
      :moduleId="moduleId"
      :moduleFlag="moduleFlag"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="'add'"
      @change="onRefresh()"
    />
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import SettingFollow from './setting-follow';

const listMixin = buildListMixin({
  relation: ['moduleId', 'moduleFlag'],
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdRelateModuleId: _.moduleId,
    fdRelateModule: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdRelateModule && !!query.fdRelateModuleId
      ? api.common.getFollowRecord(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'follow-record',
  mixins: [listMixin, formatMixin],
  components: {
    SettingFollow,
  },
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  data() {
    return {
      itemValue: {},
      itemVisible: false,
    };
  },
  methods: {
    handleAddItem() {
      this.itemValue = {};
      this.itemVisible = true;
    },
  },
};
</script>
