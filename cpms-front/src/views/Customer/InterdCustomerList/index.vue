<template>
  <list-layout class="customer-list">
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>客户管理</p-breadcrumb-item>
            <p-breadcrumb-item>意向客户列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div class="data-grid">
        <p-row :gutter="[24, 16]">
          <p-col class="col" :span="4">
            <div>
              <div class="total">{{ reportStatistics.fdCreateTotal || 0 }}</div>
              <div class="category">我的总客户数</div>
            </div>
          </p-col>
          <p-col class="col" :span="4">
            <div>
              <div class="total">
                {{ reportStatistics.fdShareTotal || 0 }}
              </div>
              <div class="category">共享给我的客户总数</div>
            </div>
          </p-col>
          <p-col class="col" :span="4">
            <div>
              <div class="total">
                {{ reportStatistics.fdNewCreateCount || 0 }}
              </div>
              <div class="category">本月新建客户</div>
            </div>
          </p-col>
          <p-col class="col" :span="4">
            <div>
              <div class="total">
                {{ reportStatistics.fdSuccessCount || 0 }}
              </div>
              <div class="category">本月成交客户</div>
            </div>
          </p-col>
          <p-col class="col" :span="4">
            <div>
              <div class="total">{{ reportStatistics.fdVisitCount || 0 }}</div>
              <div class="category">本月拜访客户</div>
            </div>
          </p-col>
          <p-col class="col" style="border-right: none" :span="4">
            <div>
              <div class="total">
                {{ reportStatistics.fdNewProjectCount || 0 }}
              </div>
              <div class="category">本月新建项目</div>
            </div>
          </p-col>
        </p-row>
      </div>
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <p-input placeholder="请输入" allow-clear v-model="query.keyword" />
          </p-switch-form-item>
          <p-switch-form-item label="客户类型">
            <select-dict
              placeholder="请选择"
              systemCode="cpms"
              dictCode="cpms_cust_type"
              v-model="query.fdCustType"
              allow-clear
            />
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
          <p-switch-form-item label="客户状态">
            <select-customer-status
              placeholder="请选择"
              v-model="query.fdStatus"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.creationTime" />
          </p-switch-form-item>
          <p-switch-form-item label="更新时间">
            <p-range-picker v-model="query.updateTimeCondition" />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/cust/excelExport"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出客户报表</p-button>
            </download-wrapper>
            <download-wrapper
              url="/api/cpms/custAddress/addressExcelExport"
              :query="reportQuery"
              :title="addressReportTitle"
            >
              <p-button type="primary">导出客户地址</p-button>
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
          <template slot="fdCustName" slot-scope="text, record">
            <div :title="text" @click="handleDeatil(record.id, 'interd')">
              <p-button-link style="color: #040c2c">{{ text || '' }}</p-button-link>
            </div>
          </template>
          <template slot="fdCustIndustry" slot-scope="text, record">
            <dict-text
              :value="(record.fdCustIndustry || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_business"
            />
          </template>
          <template slot="fdCustType" slot-scope="text, record">
            <dict-text
              :value="(record.fdCustType || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_cust_type"
            />
          </template>
          <template slot="fdProjectCount" slot-scope="text, record">
            <div :title="text" @click="handleProjectList(record)">
              <p-button-link style="color: #040c2c">{{ text || '0' }}</p-button-link>
            </div>
          </template>
          <template slot="fdStatus" slot-scope="text">
            <status-tag :status="text">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDeatil(record.id, 'interd')"
                >详情</p-button-link
              >

              <p-button-link
                @click="handleEdit(record.id)"
                v-if="checkButton(record, 'edit')"
                >编辑</p-button-link
              >

              <p-button-link
                @click="handleVisit(record)"
                v-if="checkButton(record, 'visit')"
                >拜访</p-button-link
              >

              <p-button-link
                @click="handleValid(record)"
                v-if="checkButton(record, 'isValid')"
                >作废</p-button-link
              >

              <p-button-link
                @click="handleDelete(record)"
                v-if="checkButton(record, 'delete')"
                >删除</p-button-link
              >

              <p-button-link
                @click="handleFormal(record)"
                v-if="checkButton(record, 'toSap')"
                >转SAP</p-button-link
              >

              <oawithdraw-wrapper
                v-if="checkButton(record, 'withdrawCust')"
                :fdModuleId="record.id"
                fdModuleFlag="cpms_cust_main"
                style="margin: 0px 10px"
                @change="onRefresh(false)"
              >
                <p-button-link>撤回</p-button-link>
              </oawithdraw-wrapper>

              <p-button-link
                v-if="checkButton(record, 'toProject')"
                @click="handleTransferProject(record)"
                >转项目</p-button-link
              >
              <p-button-link
                v-if="checkButton(record, 'addressMaintain')"
                @click="handleMaintenanceAddress(record)"
                >客户地址维护</p-button-link
              >
            </span>
          </template>
        </p-table>
      </div>
      <!-- 作废、删除弹窗 -->
      <cancel-operation
        :invalidReasons="invalidReasons"
        :visible.sync="cancelVisible"
        :action="action"
        @change="onRefresh"
      />
      <!-- 客户地址维护 -->
      <maintain-address :moduleId="id" :visible.sync="addressVisible" />
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import userMixin from '@/mixins/user';
import formMixin from '../InterdCustomerEdit/form';
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
import SelectCustomerStatus from '../components/select/customer-status';
import CancelOperation from '../components/operations/cancel';
import MaintainAddress from './maintain-address';

const listMixin = buildListMixin({
  properties: [
    'keyword',
    { key: 'sorter', value: [] },
    { key: 'fdCustType', value: [] },
    { key: 'fdCustIndustry', value: [] },
    { key: 'fdStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { creationTime = [], updateTimeCondition = [], sorter = [] } = query;

    let targetQuery = {
      fdCustName: query.keyword,
      fdCustType: (query.fdCustType[0] || {}).value,
      fdCustIndustry: (query.fdCustIndustry[0] || {}).value,
      fdStatus: query.fdStatus.map((d) => d.value).join(','),
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
    if (updateTimeCondition.length > 0) {
      targetQuery = {
        ...targetQuery,
        updateStartTimeParam: `${updateTimeCondition[0].format('YYYY-MM-DD')} 00:00:00`,
        updateEndTimeParam: `${updateTimeCondition[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    return targetQuery;
  },
  getData: async (_, query) => {
    const res = await api.customer.getCustomerList(query);
    const data = await api.customer.getCustomerReportStatistics();
    _.reportStatistics = data;
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
        dataIndex: 'fdCustName',
        scopedSlots: { customRender: 'fdCustName' },
        sorter: true,
        hider: true,
      },
      {
        title: '客户编码',
        dataIndex: 'fdNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '所属行业',
        dataIndex: 'fdCustIndustry',
        scopedSlots: { customRender: 'fdCustIndustry' },
        sorter: true,
        hider: true,
      },
      {
        title: '客户类型',
        dataIndex: 'fdCustType',
        scopedSlots: { customRender: 'fdCustType' },
        sorter: true,
        hider: true,
      },
      {
        title: '经营状态',
        dataIndex: 'fdCustManageforms',
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
        title: '名下项目数',
        dataIndex: 'fdProjectCount',
        scopedSlots: { customRender: 'fdProjectCount' },
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
        title: '最新更新时间',
        dataIndex: 'updateTime',
        customRender: (text, record) => _.formatDateTime(record.updateTime),
        sorter: true,
        hider: true,
      },
      {
        title: '申请单状态',
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
    SelectCustomerStatus,
    CancelOperation,
    MaintainAddress,
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
      }客户报表.xlsx`;
    },
    addressReportTitle() {
      const { createTime = [] } = this.query;

      return `${
        createTime.length > 0
          ? `${createTime[0].format('YYYY-MM-DD')}到${createTime[1].format(
              'YYYY-MM-DD'
            )}的`
          : ''
      }客户地址.xlsx`;
    },
  },
  filters: {
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
        default:
          return v;
      }
    },
  },
  data() {
    return {
      id: '',
      addressVisible: false,
      invalidReasons: {
        id: '',
        version: '',
        action: '',
      },
      cancelVisible: false,
      reportStatistics: {},
    };
  },
  methods: {
    // handleWithdraw(){
    //   console.log(111)
    // },
    handleValid(record) {
      this.cancelVisible = true;
      this.invalidReasons.id = record.id;
      this.invalidReasons.version = record.version;
      this.invalidReasons.action = 'valid';
    },
    handleDelete(record) {
      this.cancelVisible = true;
      this.invalidReasons.id = record.id;
      this.invalidReasons.version = record.version;
      this.invalidReasons.action = 'delete';
    },
    handleProjectList(record) {
      this.$router.push({
        path: `/Business/ProjectList`,
        query: {
          fdCustName: record.fdCustName,
          fdCustMainId: record.id,
        },
      });
    },
    handleVisit(record) {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'customer',
          targetId: record.id,
        },
      });
    },
    handleTransferProject(record) {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'customer',
          targetId: record.id,
        },
      });
    },
    handleMaintenanceAddress(record) {
      this.id = record.id;
      this.addressVisible = true;
    },
    handleFormal(record) {
      this.$router.push({
        path: `/Customer/SAPCustomerCreate`,
        query: {
          fdCustMainId: record.id,
          fdEnterpriseId: record.fdEnterpriseId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.customer-list {
  .data-grid {
    padding: 20px 30px;
    margin: 30px 0px;
    border-top: 1px solid #e7e3e3;
    border-bottom: 1px solid #e7e3e3;
    .col {
      text-align: center;
      border-right: 1px solid #d9d9d9;
      .total {
        font-size: 28px;
        color: $theme-color;
        font-weight: 600;
      }
      .category {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
