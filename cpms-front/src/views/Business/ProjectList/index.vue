<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>商机管理</p-breadcrumb-item>
            <p-breadcrumb-item>项目列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button
            type="primary"
            @click="showProjectType = true"
            style="margin-left: 8px"
          >
            新建
          </p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="项目名称">
            <p-input v-model="query.fdName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="单据编号">
            <p-input v-model="query.fdNumber" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="客户/代理商">
            <select-customer
              status="pass"
              v-model="query.fdCustMainId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目类型">
            <select-project-type
              :type="0"
              v-model="query.fdProjectTypeId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLine"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目状态">
            <select-project-status
              v-model="query.fdProjectStatus"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="更新时间">
            <p-range-picker v-model="query.updateTime" />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/projectMain/export-project"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出项目报表</p-button>
            </download-wrapper>
            <download-wrapper
              url="/api/cpms/projectMain/export-project-product"
              :query="reportQuery"
              title="产品报表.xlsx"
            >
              <p-button type="primary">导出产品报表</p-button>
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
        <project-counter v-model="report" />
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
          <template slot="fdProjectStatusName" slot-scope="text, record">
            <status-tag :status="record.fdProjectStatus">
              {{ record.fdProjectStatusName }}
            </status-tag>
          </template>
          <template slot="fdBusinessCode" slot-scope="text, record">
            <dict-text
              :value="(record.fdBusinessCode || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_business"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)"> 详情 </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'order')"
                @click="handleTransferOrder(record.fdName, record.id)"
                >转订单
              </p-button-link>
              <p-button-link
                @click="handleEdit(record.id)"
                v-if="checkButton(record, 'edit')"
              >
                编辑
              </p-button-link>
              <p-button-link
                @click="handleFollow(record)"
                v-if="checkButton(record, 'followUp')"
              >
                跟进
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'visit')"
                @click="handleVisit(record)"
              >
                拜访
              </p-button-link>
              <p-button-link
                v-if="checkButton(record, 'close')"
                @click="handleClose(record)"
              >
                关闭
              </p-button-link>

              <oawithdraw-wrapper
                v-if="checkButton(record, 'withdrawProject')"
                :fdModuleId="record.id"
                fdModuleFlag="cpms_project_main"
                style="margin: 0px 10px"
                @change="onRefresh(false)"
              >
                <p-button-link>撤回</p-button-link>
              </oawithdraw-wrapper>

              <p-button-link
                @click="handleDelete(record)"
                v-if="checkButton(record, 'delete')"
              >
                删除
              </p-button-link>
            </span>
          </template>
        </p-table>
      </div>

      <selection-project-type
        :visible.sync="showProjectType"
        @change="handleSelectProjectType"
      />

      <project-close
        :moduleId="selectedId"
        :visible.sync="showProjectClose"
        @change="onRefresh"
      />
      <!-- 作废、删除弹窗 -->
      <!-- <cancel-operation
        :moduleId="selectedId"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      /> -->
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

import SelectProjectType from '../components/select/project-type';
import SelectProjectStatus from '../components/select/project-status';
import ProjectCounter from './project-counter';
import SelectCustomer from '@/views/components/select/customer';
import SelectProductLine from '@/views/components/select/product-line';
import SelectionProjectType from '../components/selection-project-type';
// import CancelOperation from '../../Business/components/operations/cancel';

import ProjectClose from '../components/project-close';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';

import formMixin from '../ProjectEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdName',
    'fdNumber',
    { key: 'sorter', value: [] },
    { key: 'fdCustMainId', value: [] },
    { key: 'fdProjectTypeId', value: [] },
    { key: 'fdProductLine', value: [] },
    { key: 'createTime', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdProjectStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], updateTime = [], sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdName: query.fdName,
      fdNumber: query.fdNumber,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectTypeId: (query.fdProjectTypeId[0] || {}).value,
      fdProductLine: query.fdProductLine.map((d) => d.value).join(','),
      fdProjectStatus: query.fdProjectStatus.map((d) => d.value).join(','),
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
        fdCreateStartTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (updateTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdUpdateStartTime: `${updateTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdUpdateEndTime: `${updateTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    _.reportQuery = targetQuery;

    return targetQuery;
  },
  getData: (_, query) => {
    api.business.getProjectReportList(query).then((report) => {
      _.report = report;
    });

    return api.business.getProjectList(query);
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
        title: '客户/代理商',
        dataIndex: 'fdCustName',
        width: 250,
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdName',
        width: 300,
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
        title: '项目类型',
        dataIndex: 'fdProjectTypeName',
        sorter: true,
        hider: true,
      },
      {
        title: '产品线',
        dataIndex: 'productLineName',
        sorter: false,
        hider: true,
      },
      {
        title: '所属行业',
        dataIndex: 'fdBusinessCode',
        scopedSlots: { customRender: 'fdBusinessCode' },
        sorter: true,
        hider: true,
      },

      {
        title: '项目总金额(元)',
        dataIndex: 'fdProjectSum',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '预计成交把握度 ',
        dataIndex: 'fdSuccessRate',
        customRender: (text, record) => `${record.fdSuccessRate || '--'}%`,
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
        title: '创建时间 ',
        dataIndex: 'fdCreateTime',
        customRender: (text, record) => _.formatDateTime(record.fdCreateTime),
        sorter: true,
        hider: true,
      },
      {
        title: '状态',
        dataIndex: 'fdProjectStatusName',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: {
          customRender: 'fdProjectStatusName',
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 180,
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
  sorterMap: {
    fdCreateTime: 'createTime',
  },
});

export default {
  name: '项目列表',
  mixins: [listMixin, formatMixin, commonMixin, tableMixin, formMixin],
  components: {
    SelectProjectType,
    SelectCustomer,
    SelectProductLine,
    ProjectCounter,
    SelectionProjectType,
    ProjectClose,
    SelectProjectStatus,
    // CancelOperation,
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
      }项目报表.xlsx`;
    },
  },
  data() {
    return {
      report: {},
      reportQuery: {},
      showProjectType: false,
      showProjectClose: false,
      selectedId: '',
      // cancelVisible: false,
    };
  },
  created() {
    const { fdCustMainId, fdCustName } = this.$route.query;

    if (!!fdCustMainId) {
      this.query.fdCustMainId = [
        {
          text: fdCustName,
          value: fdCustMainId,
        },
      ];
    }
  },
  methods: {
    handleVisit(record) {
      this.$router.push({
        path: `/Salesman/Visit/VisitCreate`,
        query: {
          source: 'project',
          targetId: record.id,
        },
      });
    },

    handleFollow(record) {
      this.$router.push({
        path: `/Business/ProjectFollow/${record.id}`,
        query: {
          projectTypeId: record.fdProjectTypeId,
          projectTypeName: record.fdProjectTypeName,
        },
      });
    },
    handleClose(record) {
      this.selectedId = record.id;
      this.showProjectClose = true;
    },
    handleSelectProjectType(value) {
      value = value[0];
      if (!!value) {
        this.handleCreate({
          projectTypeId: value.id,
          projectTypeName: value.fdName,
        });
      }
    },
    // handleDelete(record) {
    //   this.selectedId = record.id;
    //   this.cancelVisible = true;
    // },
    // 删除按钮
    handleDelete(record) {
      this.$confirm({
        title: '确认要删除当前行?',
        onOk: async () => {
          await api.business.postCloseProject({
            id: record.id,
            fdIsValid: '0',
          });
          this.$message.success('删除成功');
          this.onRefresh();
        },
        onCancel: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
