<template>
  <list-layout class="customer-list">
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>客户管理</p-breadcrumb-item>
            <p-breadcrumb-item>正式客户列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <p-input placeholder="请输入" allow-clear v-model="query.keyword" />
          </p-switch-form-item>
          <p-switch-form-item label="客户编码">
            <p-input placeholder="请输入" allow-clear v-model="query.fdSapNumber" />
          </p-switch-form-item>
          <p-switch-form-item label="增值税登记号">
            <p-input placeholder="请输入" allow-clear v-model="query.fdSapUnifiedCode" />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-input placeholder="请输入" allow-clear v-model="query.fdUserName" />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.creationTime" />
          </p-switch-form-item>
          <p-switch-form-item label="所属区域">
            <div style="display: flex">
              <select-province
                style="flex: 1"
                placeholder="请选择"
                v-model="query.fdSapProvinceCode"
                allow-clear
                @change="query.fdSapCityCode = []"
              />
              <select-city
                style="flex: 1; margin-left: 4px"
                :province-code="(query.fdSapProvinceCode[0] || {}).value"
                placeholder="请选择"
                v-model="query.fdSapCityCode"
                @change="query.fdSapCountyCode = []"
                allow-clear
              />
              <select-county
                style="flex: 1; margin-left: 4px"
                :city-code="(query.fdSapCityCode[0] || {}).value"
                placeholder="请选择"
                v-model="query.fdSapCountyCode"
                allow-clear
              />
            </div>
          </p-switch-form-item>
          <template slot="button">
            <p-popover placement="bottomLeft" trigger="click">
              <template slot="content">
                <table-hider v-model="propertiesMeta" />
              </template>
              <p-button type="primary" icon="filter" />
            </p-popover>

            <p-button type="primary" @click="onRefresh(false)" icon="search" />
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
            t,
          }"
          @change="handleList"
        >
          <template slot="fdAgent" slot-scope="text">
            {{ text | IsAgent }}
          </template>
          <template slot="fdStatus" slot-scope="text">
            <status-tag :status="text">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
          <template slot="fdSapAddress" slot-scope="text, record">
            {{ record.fdSapProvince ? record.fdSapProvince : ''
            }}{{ record.fdSapCity ? record.fdSapCity : ''
            }}{{ record.fdSapCounty ? record.fdSapCounty : '' }}
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDeatil(record.id)">详情</p-button-link>

              <p-button-link
                @click="handleEdit(record.id)"
                v-if="checkButton(record, 'edit')"
                >编辑</p-button-link
              >

              <p-popover title="审批驳回" trigger="click">
                <template slot="content">
                  <p>驳回原因请前往财务共享系统查看。</p>
                </template>
                <p-button-link type="primary" v-if="checkButton(record, 'reject')"
                  >驳回原因</p-button-link
                >
              </p-popover>

              <p-popconfirm
                title="是否确认删除当前行数据?"
                @confirm="handleDelete(record, index)"
                style="margin-left: 10px"
              >
                <p-button-link>删除</p-button-link>
              </p-popconfirm>

              <!-- <p-button-link
                @click="
                  ((invalidReasons.id = record.id),
                  (invalidReasons.version = record.version)) &&
                    (cancelVisible = true)
                "
                v-if="checkButton(record, 'isValid')"
                >作废</p-button-link
              > -->
            </span>
          </template>
        </p-table>
      </div>
      <cancel-operation
        :invalidReasons="invalidReasons"
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
import formMixin from '../SAPCustomerEdit/form';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
import CancelOperation from '../components/operations/cancel';
import SelectProvince from '@/views/Customer/components/select/sap-province';
import SelectCity from '@/views/Customer/components/select/sap-city';
import SelectCounty from '@/views/Customer/components/select/sap-county';

const listMixin = buildListMixin({
  properties: [
    'keyword',
    'fdSapNumber',
    'fdSapUnifiedCode',
    'fdUserName',
    { key: 'sorter', value: [] },
    { key: 'fdSapProvinceCode', value: [] },
    { key: 'fdSapCityCode', value: [] },
    { key: 'fdSapCountyCode', value: [] },
  ],
  getQuery: (_, query) => {
    const { creationTime = [], sorter = [] } = query;

    let targetQuery = {
      fdSapCustName: query.keyword,
      fdSapNumber: query.fdSapNumber,
      fdSapUnifiedCode: query.fdSapUnifiedCode,
      fdUserName: query.fdUserName,
      fdSapProvinceCode: (query.fdSapProvinceCode[0] || []).value,
      fdSapCityCode: (query.fdSapCityCode[0] || []).value,
      fdSapCountyCode: (query.fdSapCountyCode[0] || []).value,
      pageNo: query.pageNo,
      limit: query.pageSize,
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

    if (creationTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        createStartTimeParam: `${creationTime[0].format('YYYY-MM-DD')} 00:00:00`,
        createEndTimeParam: `${creationTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: async (_, query) => {
    const res = await api.customer.getSapCustomerList(query);
    return res;
  },
});

const tableMixin = buildTable4ListMixin({
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
        title: '客户名称',
        dataIndex: 'fdSapCustName',
        scopedSlots: { customRender: 'fdSapCustName' },
        sorter: true,
        hider: true,
      },
      {
        title: '客户编码',
        dataIndex: 'fdSapNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '增值税登记号',
        dataIndex: 'fdSapUnifiedCode',
        sorter: true,
        hider: true,
      },
      {
        title: '业务员',
        dataIndex: 'fdUserName',
        sorter: true,
        hider: true,
      },
      {
        title: '省市县信息',
        dataIndex: 'fdSapAddress',
        scopedSlots: { customRender: 'fdSapAddress' },
        sorter: true,
        hider: true,
      },
      {
        title: '是否代理商',
        dataIndex: 'fdAgent',
        scopedSlots: { customRender: 'fdAgent' },
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        customRender: (text, record) => _.formatDateTime(record.createTime),
        sorter: true,
        hider: true,
      },
      {
        title: '申请单状态',
        dataIndex: 'fdSapStatus',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'fdStatus' },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 140,
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
});

export default {
  name: '客户列表',
  mixins: [listMixin, userMixin, formatMixin, commonMixin, tableMixin, formMixin],
  components: {
    CancelOperation,
    SelectProvince,
    SelectCity,
    SelectCounty,
  },
  filters: {
    IsAgent(v) {
      switch (v) {
        case '10A':
          return '代理商';
        default:
          return '';
      }
    },
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        case 'fail':
          return '推送异常';
        default:
          return v;
      }
    },
  },
  data() {
    return {
      invalidReasons: {
        id: '',
        version: '',
      },
      cancelVisible: false,
    };
  },
  methods: {
    async handleDelete(record) {
      try {
        await api.customer.deleteDeleteSapCustomer(record.id);
        this.$message.success('客户删除成功');
        this.onRefresh();
      } catch (e) {}
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
