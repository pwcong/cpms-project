<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>个人空间</p-breadcrumb-item>
            <p-breadcrumb-item>我的反馈</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button style="margin-left: 8px" type="primary" @click="handleCreate()">
            新建
          </p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <!-- <p-switch-form-item label="提问者姓名">
            <p-input v-model="query.fdUserName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="提问者手机号">
            <p-input v-model="query.fdMobile" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="提问者邮箱">
            <p-input v-model="query.fdEmail" placeholder="请输入" />
          </p-switch-form-item> -->
          <p-switch-form-item label="提问时间">
            <p-range-picker v-model="query.date" />
          </p-switch-form-item>
          <p-switch-form-item label="问题状态">
            <select-question-status
              v-model="query.fdStatus"
              allow-clear
              multiple
              placeholder="请选择"
            />
          </p-switch-form-item>
          <template slot="button">
            <p-button type="primary" @click="onRefresh(false)" icon="search" />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
          :scroll="{ x: true }"
          rowKey="id"
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
              title: '问题描述',
              dataIndex: 'fdDesc',
            },
            {
              title: '提问时间',
              dataIndex: 'fdDate',
              width: 100,
              customRender: (text, record, index) => formatDateTime(record.fdDate),
            },
            {
              title: '处理人姓名',
              dataIndex: 'fdHandleUserName',
              width: 80,
            },
            {
              title: '问题状态',
              dataIndex: 'fdStatusName',
              fixed: 'right',
              width: 80,
              align: 'center',
              scopedSlots: { customRender: 'fdStatusName' },
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 80,
              fixed: 'right',
              scopedSlots: { customRender: 'operation' },
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
          <template slot="fdStatusName" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ record.fdStatusName }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)">详情</p-button-link>
            </span>
          </template>
        </p-table>
      </div>

      <setting-issue
        :moduleId="settingId"
        :mode="settingMode"
        :visible.sync="settingVisible"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin, userMixin } from '@/mixins';
import api from '@/api';
import SelectQuestionStatus from '../components/select/question-status';
import SettingIssue from '@/layouts/components/issue-feedback/setting-issue';

const listMixin = buildListMixin({
  properties: [
    'fdUserName',
    'fdMobile',
    'fdEmail',
    {
      key: 'date',
      value: [],
    },
    {
      key: 'fdStatus',
      value: [],
    },
  ],
  getQuery: (_, query) => {
    const { date = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdUserName: query.fdUserName,
      fdMobile: query.fdMobile,
      fdEmail: query.fdEmail,
      fdStatus: (query.fdStatus[0] || {}).value,
      createBy: _.user.uid,
    };

    if (date.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdDateStartTime: `${date[0].format('YYYY-MM-DD')} 00:00:00`,
        fdDateEndTime: `${date[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: async (_, query) => {
    const res = await api.common.getQuestionList(query);
    return res;
  },
});

export default {
  name: '我的反馈',
  mixins: [listMixin, formatMixin, userMixin],
  components: {
    SelectQuestionStatus,
    SettingIssue,
  },
  data() {
    return {
      settingVisible: false,
      settingMode: 'add',
      settingId: '',
    };
  },
  methods: {
    handleDetail(record) {
      this.settingId = record.id;
      this.settingMode = 'view';
      this.settingVisible = true;
    },
    handleCreate() {
      this.settingId = '';
      this.settingMode = 'add';
      this.settingVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
