<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>商机管理</p-breadcrumb-item>
            <p-breadcrumb-item>授权管理</p-breadcrumb-item>
            <p-breadcrumb-item>授权查询</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate"> 新建 </p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <select-customer
              allow-clear
              status="pass"
              placeholder="请选择"
              v-model="query.fdCustId"
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目名称">
            <!-- <select-project
              allow-clear
              placeholder="请选择"
              v-model="query.fdProjectName"
            /> -->
            <p-input v-model="query.fdProjectName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/projectGrantMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出授权报表</p-button>
            </download-wrapper>

            <p-popover placement="bottomLeft" trigger="click">
              <template slot="content">
                <table-hider v-model="propertiesMeta" />
              </template>
              <p-button type="primary" icon="filter" />
            </p-popover>

            <p-button
              style="margin-top: -4px"
              type="primary"
              @click="onRefresh(false)"
              icon="search"
            />
          </template>
          <p-switch-form-item label="项目状态">
            <select-grant-status
              v-model="query.fdStatus"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
          :scroll="{ x: true }"
          rowKey="id"
          :loading="loading"
          :columns="propertiesWithMeta"
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
          @change="handleList"
        >
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ text | formatStatus }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)">详情</p-button-link>
              <p-button-link
                v-if="checkButton(record, 'edit', 'eject')"
                @click="handleEdit(record.id)"
                >编辑
              </p-button-link>
              <oawithdraw-wrapper
                v-if="checkButton(record, 'withdrawGrant')"
                :fdModuleId="record.id"
                fdModuleFlag="cpms_project_grant_main"
                style="margin: 0px 10px"
                @change="onRefresh(false)"
              >
                <p-button-link>撤回</p-button-link>
              </oawithdraw-wrapper>
              <p-button-link
                v-if="checkButton(record, 'edit', 'eject')"
                @click="handleDel(record)"
                >删除
              </p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import formMixin from '../GrantEdit/form';
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';

// import SelectProject from "@/views/components/select/project";
import SelectCustomer from '@/views/components/select/customer';
import SelectGrantStatus from '@/views/Business/Grant/components/select/grant-status';

const tableMixin = buildTable4ListMixin({
  sorterMap: {
    createByName: 'createBy',
    updateByName: 'updateBy',
  },
  getProperties: (_) => {
    return [
      {
        title: '序号',
        width: 50,
        fixed: 'left',
        dataIndex: 'index',
        customRender: (text, record, index) => `${index + 1}`,
      },
      {
        title: '被授权代理商名称',
        dataIndex: 'fdCustName',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdProjectName',
        sorter: false,
        hider: true,
      },
      {
        title: '单据编号',
        dataIndex: 'fdNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '盖章法人',
        dataIndex: 'fdCorporateName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建人',
        dataIndex: 'createByName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        hider: true,
      },
      {
        title: '更新人',
        dataIndex: 'updateByName',
        sorter: true,
        hider: true,
      },
      {
        title: '被授权时间起',
        dataIndex: 'fdBeginTime',
        sorter: true,
        hider: true,
        customRender: (text, record) => _.formatDate(text),
      },
      {
        title: '授权理由',
        ellipsis: true,
        dataIndex: 'fdReasonSummary',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdReasonSummary' },
      },
      {
        title: '授权状态',
        dataIndex: 'fdStatus',
        scopedSlots: { customRender: 'fdStatus' },
        align: 'center',
        fixed: 'right',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 120,
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
});

const listMixin = buildListMixin({
  properties: [
    'fdProjectName',
    { key: 'sorter', value: [] },
    { key: 'fdCustId', value: [] },
    { key: 'createTime', value: [] },
    { key: 'fdStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdProjectName: query.fdProjectName,
      fdCustId: (query.fdCustId[0] || {}).value,
      fdStatus: (query.fdStatus[0] || {}).value,
    };
    if (sorter.length > 0) {
      targetQuery = {
        ...targetQuery,
        sortList: sorter
          .filter((d) => !!d.value)
          .map((d) => `${d.key}@${d.value}`)
          .join(','),
      };
    }
    if (createTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdCreateBeginTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.grant.getProjectGrantList(query);
  },
});

export function formatStatus(v) {
  switch (v) {
    case 'todo':
      return '待审批';
    case 'success':
      return '通过';
    case 'done':
      return '完成';
    case 'audit':
      return '审批中';
    case 'pass':
      return '审批通过';
    case 'reject':
      return '审批驳回';
    case 'draft':
      return '暂存';
    default:
      return v;
  }
}

export default {
  name: '授权列表',
  mixins: [listMixin, commonMixin, formatMixin, tableMixin, formMixin],
  components: {
    // SelectProject,
    SelectCustomer,
    SelectGrantStatus,
  },
  computed: {
    reportTitle() {
      const { createTime = [] } = this.query;

      return `${
        createTime.length > 0
          ? `${createTime[0].format('YYYY-MM-DD')}到${createTime[1].format(
              'YYYY-MM-DD'
            )}的`
          : ''
      }授权报表.xlsx`;
    },
  },
  data() {
    return {
      reportQuery: {},
    };
  },
  methods: {
    // 删除逻辑
    handleDel(record) {
      this.$confirm({
        title: '确认要删除当前行?',
        onOk: async () => {
          await api.grant.delGrantMain({
            id: record.id,
            version: record.version,
            fdIsValid: 0,
          });
          this.$message.success('删除成功');
          this.onRefresh();
        },
        onCancel: () => {},
      });
    },
  },
  filters: {
    formatStatus(v) {
      return formatStatus(v);
    },
  },
};
</script>

<style lang="scss" scoped></style>
