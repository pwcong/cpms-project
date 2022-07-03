<template>
  <list-layout class="customer-list">
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>系统权限管理</p-breadcrumb-item>
            <p-breadcrumb-item>角色配置</p-breadcrumb-item>
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
          <p-switch-form-item label="名称">
            <p-input placeholder="请输入" v-model="query.fdName" />
          </p-switch-form-item>
          <p-switch-form-item label="角色标识">
            <p-input placeholder="请输入" v-model="query.fdRoleCode" />
          </p-switch-form-item>
          <p-switch-form-item label="类型标识">
            <select-type-line
              v-model="query.fdTypeCode"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <template slot="button">
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
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <!-- 名下项目数后台需要调别人得接口，暂时没有 -->
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
          <template slot="operation" slot-scope="text, record">
            <span>
              <!-- <p-button-link @click="handleDeatil(record)">查看详情</p-button-link>
              <p-button-link @click="handleSynchronousLog(record)"
                >查看同步日志</p-button-link
              > -->
              <p-button-link @click="handleEdit(record)">编辑</p-button-link>
              <p-popconfirm
                title="确认删除当前行数据?"
                @confirm="handleDelete(record, text)"
              >
                <p-button-link> 删除 </p-button-link>
              </p-popconfirm>
            </span>
          </template>
          <template slot="fdIsValid" slot-scope="text, record">
            <status-tag :status="record.fdIsValid">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
        </p-table>
      </div>
      <!-- 角色权限编辑 -->
      <role-config-edit
        :id="id"
        :fdIsValid="fdIsValid"
        :value="roleEdit"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import userMixin from '@/mixins/user';
import SelectCustomerStatus from '@/views/Customer/components/select/customer-status';
import RoleConfigEdit from './role-config-edit';
import { buildTable4ListMixin } from '@/views/mixins';
import SelectTypeLine from '../components/select/type-line';
const tableMixin = buildTable4ListMixin({
  sorterMap: {
    fdSapCustName: 'customerName',
    companyCode: 'companyCode',
    customerId: 'customerId',
    salesPersonId: 'salesPersonId',
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
        title: '描述',
        dataIndex: 'fdConfigTitle',
        hider: true,
      },
      {
        title: '类型标识',
        dataIndex: 'fdTypeCode',
        hider: true,
      },
      {
        title: '类型',
        dataIndex: 'fdTypeName',
        hider: true,
      },
      {
        title: '角色标识',
        dataIndex: 'fdRoleCode',
        hider: true,
      },

      {
        title: '名称',
        dataIndex: 'fdName',
        hider: true,
      },

      {
        title: '创建人',
        dataIndex: 'createBy',
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        hider: true,
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '更新人',
        dataIndex: 'updateBy',
        hider: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',

        hider: true,
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        hider: true,
      },
      {
        title: '状态',
        dataIndex: 'fdIsValid',
        fixed: 'right',
        hider: true,
        scopedSlots: { customRender: 'fdIsValid' },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
});

const listMixin = buildListMixin({
  properties: [
    'fdName',
    'fdRoleCode',
    { key: 'fdTypeCode', value: [] },
    { key: 'sorter', value: [] },
  ],
  getQuery: (_, query) => {
    const { date = [] } = query;

    let targetQuery = {
      fdName: query.fdName,
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdRoleCode: query.fdRoleCode,
      fdTypeCode: (query.fdTypeCode[0] || {}).value,
    };

    if (date.length > 0) {
      targetQuery = {
        ...targetQuery,
        createStartTime: `${date[0].format('YYYY-MM-DD')} 00:00:00`,
        createEndTime: `${date[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: (_, query) => {
    return api.common.getSysRoleConfig(query);
  },
});

export default {
  name: '角色配置',
  mixins: [listMixin, userMixin, formatMixin, tableMixin],
  components: {
    SelectCustomerStatus,
    RoleConfigEdit,
    SelectTypeLine,
  },
  data() {
    return {
      roleEdit: {},
      cancelVisible: false,
      id: '',
      fdIsValid: '',
    };
  },
  methods: {
    handleSynchronousLog(record) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${record.cpmsCustId}`,
      });
    },
    handleEdit(record) {
      this.roleEdit = { ...record };
      this.cancelVisible = true;
      this.id = record.id;
      this.fdIsValid = record.fdIsValid;
    },
    async handleDelete(record) {
      await api.common.deleteSysRoleConfig(record.id);
      this.$message.success('删除成功');
      this.onRefresh();
    },
    handleCreate() {
      this.cancelVisible = true;
      this.roleEdit = {};
      this.id = '';
      this.fdIsValid = '';
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case '1':
          return '有效';
        default:
          return '无效';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
