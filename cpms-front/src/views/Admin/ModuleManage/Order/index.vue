<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>订单管理</p-breadcrumb-item>
            <p-breadcrumb-item>销售单列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <!-- <template v-slot:action>
          <p-button type="primary" @click="handleCreate" style="margin-left: 8px">
            新建
          </p-button>
        </template> -->
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <p-input v-model="query.fdCpmsCustName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="项目名称">
            <p-input v-model="query.fdProjectName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="单据状态">
            <select-order-status
              multiple
              allow-clear
              placeholder="请选择"
              v-model="query.fdStatus"
            />
          </p-switch-form-item>
          <p-switch-form-item label="开单时间">
            <p-range-picker v-model="query.fdBillCreateDateParam" />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="所属行业">
            <select-dict
              systemCode="cpms"
              dictCode="cpms_business"
              placeholder="请选择"
              allow-clear
              v-model="query.fdBusiness"
            />
          </p-switch-form-item>

          <p-switch-form-item label="单据编号">
            <p-input placeholder="请输入" v-model="query.fdNumber" />
          </p-switch-form-item>

          <p-switch-form-item label="单据列表">
            <select-enum-list
              placeholder="请选择"
              v-model="query.fdOrderByList"
              allow-clear
            />
          </p-switch-form-item>

          <p-switch-form-item label="子单状态">
            <select-order-split-status
              multiple
              allow-clear
              placeholder="请选择"
              v-model="query.arkOrderStatusList"
            />
          </p-switch-form-item>

          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLineCode"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>

          <p-switch-form-item label="产品编码">
            <select-product
              v-model="query.fdProductCode"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>

          <template slot="button">
            <download-wrapper
              url="/api/cpms/orderMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出销售单</p-button>
            </download-wrapper>

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
          <template slot="fdBillType" slot-scope="text">
            <dict-text
              :value="(text || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_order_bill_type"
            />
          </template>

          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              <order-status-text :value="record.fdStatus" />
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)"> 详情 </p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import SelectProductLine from '@/views/components/select/product-line';
import SelectProduct from '@/views/components/select/product';
import SelectOrderStatus from '@/views/Order/components/select/order-status';
import SelectOrderSplitStatus from '@/views/Order/components/select/order-split-status';
import SelectEnumList from '@/views/Order/components/select/enum-list';
import { buildListMixin, userMixin, formatMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
import { OrderStatusText } from '@/views/Order/components/select/order-status';
import formMixin from '@/views/Order/SalesOrderEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdCpmsCustName',
    'fdProjectName',
    'fdBusinessCode',
    'fdNumber',
    // 'fdOrderByList',
    { key: 'sorter', value: [] },
    { key: 'fdStatus', value: [] },
    { key: 'arkOrderStatusList', value: [] },
    { key: 'fdBusiness', value: [] },
    { key: 'fdOrderByList', value: [] },
    { key: 'createTime', value: [] },
    { key: 'fdBillCreateDateParam', value: [] },
    { key: 'fdProductLineCode', value: [] },
    { key: 'fdProductCode', value: [] },
  ],
  getQuery: (_, query) => {
    const { fdBillCreateDateParam = [], createTime = [], sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdNumber: query.fdNumber,
      fdProjectName: query.fdProjectName,
      fdBusiness: (query.fdBusiness[0] || {}).value,
      fdCpmsCustName: query.fdCpmsCustName,
      fdProductLineCode: query.fdProductLineCode.map((d) => d.value).join(','),
      fdProductCode: query.fdProductCode.map((d) => d.value).join(','),
      fdStatus: (query.fdStatus || [])
        .map((d) => {
          return d.value;
        })
        .join(','),
      arkOrderStatusList: (query.arkOrderStatusList || [])
        .map((d) => {
          return d.value;
        })
        .join(','),
      fdOrderByList: (query.fdOrderByList || [])
        .map((d) => {
          if (d.value === 'followUp') {
            return 'followUp:'.concat(_.user.uid);
          } else if (d.value === 'createBy') {
            return 'createBy:'.concat(_.user.uid);
          }
          return d.value;
        })
        .join(','),
      fdBusinessCode: query.fdBusinessCode,
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
        createStartTimeParam: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        createEndTimeParam: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    if (fdBillCreateDateParam.length > 0) {
      targetQuery = {
        ...targetQuery,
        billCreateStartDateParam: `${fdBillCreateDateParam[0].format(
          'YYYY-MM-DD'
        )} 00:00:00`,
        billCreateEndDateParam: `${fdBillCreateDateParam[1].format(
          'YYYY-MM-DD'
        )} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: async (_, query) => {
    let res = await api.order.getOrderAdminList(query);
    // console.log('列表', res);
    return res;
  },
});

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
        title: '客户名称',
        dataIndex: 'fdCpmsCustName',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdProjectName',
        sorter: true,
        hider: true,
      },
      {
        title: '单据编号',
        dataIndex: 'fdNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '订单类型',
        dataIndex: 'fdBillType',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdBillType' },
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
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '更新人',
        dataIndex: 'updateByName',
        sorter: true,
        hider: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        sorter: true,
        hider: true,
        customRender: (text, recode) => _.formatDateTime(text),
      },
      {
        title: '状态',
        dataIndex: 'fdStatus',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'fdStatus' },
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

export default {
  name: '销售单列表',
  mixins: [listMixin, formatMixin, userMixin, commonMixin, tableMixin, formMixin],
  components: {
    SelectOrderStatus,
    SelectEnumList,
    SelectOrderSplitStatus,
    OrderStatusText,
    SelectProductLine,
    SelectProduct,
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
      }销售单报表.xlsx`;
    },
  },
  data() {
    return {
      reportQuery: {},
      craeteBy: '',
      followUp: '',
    };
  },
};
</script>

<style lang="scss" scoped></style>
