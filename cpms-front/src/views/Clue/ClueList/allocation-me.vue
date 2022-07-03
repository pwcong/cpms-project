<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>线索管理</p-breadcrumb-item>
            <p-breadcrumb-item>线索查询</p-breadcrumb-item>
            <p-breadcrumb-item>我跟进的</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button style="margin-left: 8px" type="primary" @click="handleCreate">
            新建
          </p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <!-- <p-switch-form-item label="所属机构" prop="fdAgencyCode">
            
            <p-input placeholder="请输入"
              v-model="query.fdAgencyName"
            />
          </p-switch-form-item> -->
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
          rowKey="id"
          :loading="loading"
          :scroll="{ x: true }"
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
              <p-button-link
                @click="
                  handleDetail(record.id, {
                    queryType: 'followBy',
                  })
                "
                >详情</p-button-link
              >

              <p-button-link
                v-if="checkButton(record, 'edit')"
                @click="handleEdit(record.id)"
              >
                编辑
              </p-button-link>

              <p-button-link
                v-if="checkButton(record, 'allot')"
                @click="
                  (selectedId = record.id) &&
                    (distributeVisible = true) &&
                    (version = record.version)
                "
              >
                分配
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'release')"
                @click="
                  (selectedId = record.id) &&
                    (releaseVisible = true) &&
                    (version = record.version)
                "
              >
                释放
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'follow')"
                @click="
                  (selectedId = record.id) &&
                    (claimVisible = true) &&
                    (version = record.version)
                "
              >
                认领
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'visit')"
                @click="handleVisit(record)"
              >
                拜访
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'discard')"
                @click="
                  (selectedId = record.id) &&
                    (cancelVisible = true) &&
                    (version = record.version)
                "
              >
                作废
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'followUp')"
                @click="
                  (selectedId = record.id) &&
                    (followUpVisible = true) &&
                    (version = record.version)
                "
              >
                跟进
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'changeCust')"
                @click="handleCustomers(record)"
              >
                转客户
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'changeProject')"
                @click="handleProject(record)"
              >
                转项目
              </p-button-link>
            </span>
          </template>
        </p-table>
      </div>
      <!-- 分配 -->
      <distribute-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="distributeVisible"
        @change="onRefresh"
      />
      <!-- 释放 -->
      <release-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="releaseVisible"
        @change="onRefresh"
      />
      <!-- 认领 -->
      <claim-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="claimVisible"
        @change="onRefresh"
      />
      <!-- 作废 -->
      <cancel-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      />
      <!-- 跟进 -->
      <fdrecord-operation
        :moduleId="selectedId"
        :visible.sync="followUpVisible"
        @change="onRefresh"
      />
    </template>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import { buildListMixin } from '@/mixins';
import formMixin from '../ClueEdit/form';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
import CancelOperation from '../components/operations/cancel';
import ClaimOperation from '../components/operations/claim';
import DistributeOperation from '../components/operations/distribute';
import ReleaseOperation from '../components/operations/release';
import FdrecordOperation from '../components/operations/fdrecord';

import SelectionTianyancha from '@/views/components/selection-tianyancha';
import api from '@/api';
import SelectClueStatus from '../components/select/clue-status';
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
      queryType: 'followBy',
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
        startTime: `${creationTime[0].format('YYYY-MM-DD')} 00:00:00`,
        lastTime: `${creationTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: (_, query) => {
    return api.clue.getMyClueList(query).then((res) => ({
      ...res,
      data: (res.data || []).map((d) => ({
        ...d,
        createTime: dayjs(new Date(d.createTime)).format('YYYY-MM-DD HH:mm:ss'),
      })),
    }));
  },
});

const tableMixin = buildTable4ListMixin({
  sorterMap: {
    createByName: 'createBy',
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
        title: '线索名称',
        dataIndex: 'fdClueName',
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
  name: '我跟进的',
  mixins: [listMixin, commonMixin, tableMixin, formMixin],
  components: {
    SelectClueStatus,
    SelectProvince,
    SelectCity,
    SelectionTianyancha,
    SelectProductLine,
    CancelOperation,
    ClaimOperation,
    DistributeOperation,
    ReleaseOperation,
    FdrecordOperation,
  },
  data() {
    return {
      selectedId: '',
      distributeVisible: false,
      releaseVisible: false,
      claimVisible: false,
      cancelVisible: false,
      followUpVisible: false,
      version: '',
    };
  },
  methods: {
    // 跳转拜访页
    handleVisit(record) {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },

    //跳转客户
    handleCustomers(record) {
      this.$router.push({
        path: '/Customer/InterdCustomerCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
    //跳转项目
    handleProject(record) {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
