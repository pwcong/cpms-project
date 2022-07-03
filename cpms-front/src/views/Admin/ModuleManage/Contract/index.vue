<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>合同模块</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <select-customer
              allow-clear
              placeholder="请选择"
              status="pass"
              v-model="query.fdCustMainId"
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目名称">
            <!-- <select-project
              placeholder="请选择"
              allow-clear
              :value="
                !!query.fdProjectMainName
                  ? [
                      {
                        value: query.fdProjectMainId,
                        text: query.fdProjectMainName,
                      },
                    ]
                  : []
              "
            /> -->
            <p-input v-model="query.fdProjectMainName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="审批状态">
            <select-contract-status
              allow-clear
              placeholder="请选择"
              v-model="query.fdStatus"
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/projectContractMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出合同报表</p-button>
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
            width: 100,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            showTotal: (total) => `共有 ${total} 条数据`,
          }"
          @change="handleList"
        >
          <template slot="fdCorporateName" slot-scope="value">
            <dict-text
              :value="(value || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_business"
            />
          </template>
          <template slot="fdContractTypeCode" slot-scope="text">
            <dict-text
              :value="(text || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_contract_type"
            />
          </template>
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ text | formatStatus }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)">详情</p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildTable4ListMixin } from '@/views/mixins';
import { buildListMixin, formatMixin } from '@/mixins';
import SelectCustomer from '@/views/components/select/customer';
import api from '@/api';
import SelectContractStatus from '@/views/Business/Contract/component/contract-status';

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
        title: '合同相对方名称',
        dataIndex: 'fdPartyFullName',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdProjectMainName',
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
        title: '更新人',
        dataIndex: 'updateByName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '合同开始时间',
        dataIndex: 'fdBeginTime',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatDate(text),
      },
      {
        title: '合同截至时间',
        dataIndex: 'fdEndTime',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatDate(text),
      },
      {
        title: '合同总金额(元)',
        dataIndex: 'fdTermContractPrice',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatAmount(text),
      },
      {
        title: '合同法人',
        dataIndex: 'fdCorporateName',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdCorporateName' },
      },
      {
        title: '合同类别',
        dataIndex: 'fdContractTypeCode',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdContractTypeCode' },
      },
      {
        title: '审批状态',
        dataIndex: 'fdStatus',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'fdStatus' },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
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
    'fdProjectMainName',
    { key: 'sorter', value: [] },
    { key: 'fdCustMainId', value: [] },
    { key: 'createTime', value: [] },
    { key: 'fdStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], sorter = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdStatus: (query.fdStatus[0] || {}).value,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectMainName: query.fdProjectMainName,
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
        fdBeginTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.contract.getContractList(query);
  },
});

export function formatStatus(v) {
  switch (v) {
    case 'draft':
      return '暂存';
    case 'todo':
      return '待审批';
    case 'reject':
      return '驳回';
    case 'pass':
      return '审批通过';
    case 'audit':
      return '审批中';
    default:
      return v;
  }
}

export default {
  name: '合同模块',
  mixins: [listMixin, formatMixin, tableMixin],
  components: {
    SelectCustomer,
    SelectContractStatus,
    // SelectProject,
    // ReleaseOperation,
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
      }合同报表.xlsx`;
    },
  },
  data() {
    return {
      reportQuery: {},
      // selectedId: "",
      // examineVisible: false,
      // releaseVisible: false,
    };
  },
  methods: {
    // 跳转详情页
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Contract/ContractDetail/${record.id}`,
      });
    },
    // 跳转编辑页
    handleEdit(record) {
      this.$router.push({
        path: `/Business/Contract/ContractEdit/${record.id}`,
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
