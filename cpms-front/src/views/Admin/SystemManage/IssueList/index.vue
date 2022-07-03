<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>系统运维管理</p-breadcrumb-item>
            <p-breadcrumb-item>问题列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="提问者姓名">
            <p-input v-model="query.fdUserName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="提问者手机号">
            <p-input v-model="query.fdMobile" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="提问者邮箱">
            <p-input v-model="query.fdEmail" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="提问时间">
            <p-range-picker v-model="query.date" />
          </p-switch-form-item>
          <p-switch-form-item label="是否常见问题">
            <select-yes-or-no
              v-model="query.fdIsCommon"
              allow-clear
              placeholder="请选择"
            />
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
              title: '提问者姓名',
              dataIndex: 'fdUserName',
              width: 80,
            },
            {
              title: '提问者手机号',
              dataIndex: 'fdMobile',
              width: 100,
            },
            {
              title: '提问者邮箱',
              dataIndex: 'fdEmail',
              width: 150,
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
              title: '是否常见问题',
              dataIndex: 'fdIsCommon',
              fixed: 'right',
              width: 100,
              align: 'center',
              scopedSlots: { customRender: 'fdIsCommon' },
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
              width: 120,
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
          <template slot="fdIsCommon" slot-scope="text, record">
            <p-icon type="check" v-if="record.fdIsCommon === '1'" />
          </template>
          <template slot="fdStatusName" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ record.fdStatusName }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)">详情</p-button-link>
              <p-button-link
                v-if="checkButton(record, 'accept')"
                @click="handleAccept(record)"
              >
                接受
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'close')"
                @click="handleClose(record)"
              >
                关闭
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'solved')"
                @click="handleResolve(record)"
              >
                已解决
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'setCommon')"
                @click="handleSetCommon(record, '1')"
              >
                置为常见
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'cacleCommon')"
                @click="handleSetCommon(record, '0')"
              >
                取消常见
              </p-button-link>
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
      <question-close
        :moduleId="settingId"
        :visible.sync="closeVisible"
        @change="onRefresh"
      />
      <question-solved
        :moduleId="settingId"
        :visible.sync="solvedVisible"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin, userMixin } from '@/mixins';
import api from '@/api';
import SelectQuestionStatus from '@/views/Own/components/select/question-status';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SettingIssue from '@/layouts/components/issue-feedback/setting-issue';
import QuestionClose from '@/views/Own/components/question-close';
import QuestionSolved from '@/views/Own/components/question-solved';

import { commonMixin } from '@/views/mixins';

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
    {
      key: 'fdIsCommon',
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
      fdIsCommon: (query.fdIsCommon[0] || {}).value,
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
  name: '问题列表',
  mixins: [listMixin, formatMixin, userMixin, commonMixin],
  components: {
    SelectQuestionStatus,
    SettingIssue,
    SelectYesOrNo,
    QuestionSolved,
    QuestionClose,
  },
  data() {
    return {
      settingVisible: false,
      settingMode: 'view',
      settingId: '',
      closeVisible: false,
      solvedVisible: false,
    };
  },
  methods: {
    handleDetail(record) {
      this.settingId = record.id;
      this.settingMode = 'view';
      this.settingVisible = true;
    },
    handleAccept(record) {
      this.$confirm({
        title: '是否确认接受问题?',
        onOk: async () => {
          try {
            await api.common.putQuestionForm({
              id: record.id,
              fdStatus: 'handle',
              fdHandleUserName: this.user.name,
              fdHandleLoginName: this.user.uid,
            });
            this.$message.success('问题接受成功');
            this.onRefresh();
          } finally {
          }
        },
        onCancel: () => {},
      });
    },
    handleSetCommon(record, fdIsCommon) {
      this.$confirm({
        title: `是否确认${fdIsCommon === '1' ? '置为' : '取消'}常见问题?`,
        onOk: async () => {
          try {
            await api.common.putQuestionForm({
              id: record.id,
              fdIsCommon: fdIsCommon,
            });
            this.$message.success('请求成功');
            this.onRefresh();
          } finally {
          }
        },
        onCancel: () => {},
      });
    },
    handleClose(record) {
      this.settingId = record.id;
      this.closeVisible = true;
    },
    handleResolve(record) {
      this.settingId = record.id;
      this.solvedVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
