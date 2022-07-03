<template>
  <list-layout class="customer-list">
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>客户模块</p-breadcrumb-item>
            <p-breadcrumb-item>同步失败客户</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <p-input placeholder="请输入" v-model="query.fdCustName" />
          </p-switch-form-item>
          <p-switch-form-item label="客户编码">
            <p-input placeholder="请输入" v-model="query.fdCustCode" />
          </p-switch-form-item>
          <p-switch-form-item label="社会统一信用编码">
            <p-input placeholder="请输入" v-model="query.fdUnifiedCode" />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-input placeholder="请输入" v-model="query.fdPerson" />
          </p-switch-form-item>

          <p-switch-form-item label="省市信息">
            <div style="display: flex">
              <select-province
                style="flex: 1"
                placeholder="请选择"
                v-model="query.fdProvinceCode"
                allow-clear
                @change="query.fdCityCode = []"
              />
              <select-city
                style="flex: 1; margin-left: 4px"
                :province-code="(query.fdProvinceCode[0] || {}).value"
                placeholder="请选择"
                v-model="query.fdCityCode"
                allow-clear
              />
            </div>
          </p-switch-form-item>

          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.date" />
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
          <template slot="fdProvince" slot-scope="text, record">
            <span v-if="record.fdProvince || record.fdCity">
              {{ `${record.fdProvince} - ${record.fdCity}` }}
            </span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <!-- <p-button-link @click="handleDeatil(record)">查看详情</p-button-link>
              <p-button-link @click="handleSynchronousLog(record)"
                >查看同步日志</p-button-link
              > -->
              <p-button-link @click="handleClick(record)">错误修复</p-button-link>
              <p-popconfirm
                style="margin-right: 8px"
                placement="top"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handlerebuild(record)"
              >
                <template slot="title">
                  <p>确定重新生成?</p>
                </template>
                <p-button-link type="primary">重新生成</p-button-link>
              </p-popconfirm>
            </span>
          </template>
        </p-table>
      </div>
      <!-- 错误修复 -->
      <error-repair
        :sapCustId="sapCustId"
        :fdUnifiedCode="fdUnifiedCode"
        :companyName="companyName"
        :cpmsCustId="cpmsCustId"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import userMixin from '@/mixins/user';
import SelectCustomerStatus from '@/views/Customer/components/select/customer-status';
import ErrorRepair from './error-repair';
import { buildTable4ListMixin } from '@/views/mixins';

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
        title: '公司名称',
        dataIndex: 'companyName',
        sorter: false,
        hider: true,
      },
      {
        title: '公司编码',
        dataIndex: 'companyCode',
        sorter: true,
        hider: true,
      },
      {
        title: '客户名称',
        dataIndex: 'fdSapCustName',
        sorter: true,
        hider: true,
      },
      {
        title: '客户编码',
        dataIndex: 'customerId',
        sorter: true,
        hider: true,
      },
      {
        title: '意向客户名称',
        dataIndex: 'fdCustName',
        sorter: false,
        hider: true,
      },
      {
        title: '社会统一信用编码',
        dataIndex: 'fdUnifiedCode',
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
        title: 'SAP业务员编码',
        dataIndex: 'salesPersonId',
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
        title: '一级渠道',
        dataIndex: 'firstChannelName',
        sorter: false,
        hider: true,
      },
      {
        title: '省市县信息',
        dataIndex: 'fdProvince',
        sorter: false,
        hider: true,
        scopedSlots: { customRender: 'fdProvince' },
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
    'fdUnifiedCode',
    'fdPerson',
    // 'customerId',
    'fdCustName',
    'fdSapStatus',
    'fdCustCode',
    { key: 'sorter', value: [] },
    { key: 'fdProvinceCode', value: [] },
    { key: 'fdCityCode', value: [] },
  ],
  getQuery: (_, query) => {
    const { date = [], sorter = [] } = query;

    let targetQuery = {
      fdUnifiedCode: query.fdUnifiedCode,
      fdPerson: query.fdPerson,
      // customerId: query.customerId,
      fdCustName: query.fdCustName,
      fdCustCode: query.fdCustCode,
      fdSapStatus: ['fail', 'rebuild'],
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdProvinceCode: (query.fdProvinceCode[0] || []).value,
      fdCityCode: (query.fdCityCode[0] || []).value,
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
    return api.customer.getRelateTheCustomerlistInReverse(query);
  },
});

export default {
  name: '同步失败客户',
  mixins: [listMixin, userMixin, formatMixin, tableMixin],
  components: {
    SelectCustomerStatus,
    ErrorRepair,
    SelectProvince,
    SelectCity,
  },
  data() {
    return {
      cancelVisible: false,
      sapCustId: '',
      fdUnifiedCode: '',
      companyName: '',
      cpmsCustId: '',
    };
  },
  methods: {
    // handleDeatil(record) {
    // },
    handleSynchronousLog(record) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${record.cpmsCustId}`,
      });
    },
    async handlerebuild(record) {
      const res = await api.customer.postInverselyCorrelatedCustomer([record.sapCustId]);
      if (res.code === '-1') {
        this.$message.info(res.data);
      } else {
        this.$message.success('重新生成成功');
      }
    },
    handleClick(record) {
      this.cancelVisible = true;
      this.sapCustId = record.sapCustId;
      this.companyName = record.companyName;
      this.cpmsCustId = record.cpmsCustId;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
