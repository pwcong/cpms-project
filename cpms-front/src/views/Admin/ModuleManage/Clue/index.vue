<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>线索模块</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <!-- <p-button type="primary" @click="handleAddItem">
            新建
          </p-button> -->
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="关键搜索词">
            <p-input v-model="query.keyword" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="所属行业">
            <select-dict
              placeholder="请选择"
              systemCode="cpms"
              dictCode="cpms_business"
              v-model="query.fdCustIndustry"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="所属区域">
            <div style="display: flex">
              <select-province
                style="flex: 1"
                placeholder="请选择"
                v-model="query.fdProvince"
                allow-clear
                @change="query.fdCity = []"
              />
              <select-city
                style="flex: 1; margin-left: 4px"
                :province-code="(query.fdProvince[0] || {}).value"
                placeholder="请选择"
                v-model="query.fdCity"
                allow-clear
              />
            </div>
          </p-switch-form-item>
          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLineCode"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="线索状态">
            <select-clue-status
              placeholder="请选择"
              v-model="query.fdClueStatus"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.creationTime" />
          </p-switch-form-item>
          <template slot="button">
            <!-- <download-wrapper
              url="/api/cpms/projectPriceMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出线索报表</p-button>
            </download-wrapper> -->
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
          <template slot="fdClueStatusName" slot-scope="text, record">
            <status-tag :status="record.fdClueStatus">
              {{ record.fdClueStatusName }}
            </status-tag>
          </template>
          <template slot="fdDiscardDescription" slot-scope="text">
            <div
              :title="text"
              style="max-width: 200px; text-overflow: ellipsis; overflow: hidden"
            >
              {{ text }}
            </div>
          </template>
          <template slot="fdClueDescription" slot-scope="text">
            <div
              :title="text"
              style="max-width: 200px; text-overflow: ellipsis; overflow: hidden"
            >
              {{ text }}
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)">详情</p-button-link>
            </span>
          </template>
        </p-table>
      </div>

      <setting-item
        :value="itemValue"
        :visible.sync="itemVisible"
        :mode="itemMode"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';
import { buildListMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
// import SettingItem from "./setting-item";
import SelectClueStatus from '@/views/Clue/components/select/clue-status';
import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectProductLine from '@/views/components/select/product-line';

const listMixin = buildListMixin({
  properties: [
    'keyword',
    'fdAgencyName',
    { key: 'sorter', value: [] },
    { key: 'fdClueStatus', value: [] },
    { key: 'fdCustIndustry', value: [] },
    { key: 'fdProvince', value: [] },
    { key: 'fdCity', value: [] },
    { key: 'fdProductLineCode', value: [] },
  ],
  getQuery: (_, query) => {
    const { creationTime = [], createTimeCondition = [], sorter = [] } = query;
    let targetQuery = {
      fdAgencyName: query.fdAgencyName,
      fdClueStatus: query.fdClueStatus.map((d) => d.value).join(','),
      fdCustIndustry: (query.fdCustIndustry[0] || {}).value,
      fdProductLineCode: (query.fdProductLineCode[0] || {}).value,
      fdProvinceCode: (query.fdProvince[0] || {}).value,
      fdCityCode: (query.fdCity[0] || {}).value,
      keyword: query.keyword,
      pageNo: query.pageNo,
      limit: query.pageSize,
      queryType: 'admin',
    };
    if (sorter.length > 0) {
      targetQuery = {
        ...targetQuery,
        sorterList: sorter
          .filter((d) => !!d.value)
          .map((d) => `${d.key}@${d.value}`)
          .join(','),
      };
    }
    if (creationTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        startTime: `${creationTime[0].format('YYYY-MM-DD')} 00:00:00`,
        lastTime: `${creationTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;

    return targetQuery;
  },
  getData: (_, query) => {
    return api.clue.getPageListMyClue(query).then((res) => ({
      ...res,
      data: (res.data || []).map((d) => ({
        ...d,
        createTime: dayjs(new Date(d.createTime)).format('YYYY-MM-DD HH:mm:ss'),
      })),
    }));
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
        title: '线索名称',
        dataIndex: 'fdClueName',
        width: 300,
        sorter: true,
        hider: true,
      },
      {
        title: '线索描述',
        dataIndex: 'fdClueDescription',
        scopedSlots: { customRender: 'fdClueDescription' },
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
        title: '客户名称',
        dataIndex: 'fdTerminalClient',
        sorter: true,
        hider: true,
      },
      {
        title: '联系人',
        dataIndex: 'fdClueContactName',
        sorter: true,
        hider: true,
      },
      {
        title: '区域',
        dataIndex: 'fdProvinceCode',
        customRender: (text, record) =>
          `${record.fdProvinceCode || ''} - ${record.fdCityCode || ''}`,
        sorter: true,
        hider: true,
      },
      {
        title: '产品线',
        dataIndex: 'clueProductLineList',
        customRender: (text, record) =>
          (record.clueProductLineList || []).map((d) => d.fdProductLineName).join(','),
        hider: true,
      },
      {
        title: '作废理由',
        dataIndex: 'fdDiscardDescription',
        scopedSlots: { customRender: 'fdDiscardDescription' },
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
        title: '创建人',
        dataIndex: 'createByName',
        sorter: true,
        hider: true,
      },
      {
        title: '状态',
        dataIndex: 'fdClueStatusName',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: {
          customRender: 'fdClueStatusName',
        },
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
  name: '线索模块',
  mixins: [listMixin, commonMixin, tableMixin],
  components: {
    SelectClueStatus,
    SelectProvince,
    SelectCity,
    SelectProductLine,
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
      }线索报表.xlsx`;
    },
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemMode: 'edit',
    };
  },
  methods: {
    //跳转详情页
    handleDetail(record) {
      this.$router.push({
        path: `/Clue/ClueDetail/${record.id}`,
      });
    },
    handleViewItem(value) {
      this.handleEditItem(value, 'view');
    },
    handleAddItem() {
      this.handleEditItem({}, 'add');
    },
    handleEditItem(value, mode) {
      this.itemValue = { ...value };
      this.itemVisible = true;
      this.itemMode = mode;
    },
  },
};
</script>

<style lang="scss" scoped></style>
