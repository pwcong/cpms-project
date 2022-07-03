<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>报表管理</p-breadcrumb-item>
            <p-breadcrumb-item>团队报表</p-breadcrumb-item>
            <p-breadcrumb-item>团队汇总报表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 32px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
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
          <p-switch-form-item label="商务中心" prop="fdBusinessCenter">
            <select-business
              v-model="query.fdBusinessCenter"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-select-user
              placeholder="请选择"
              :selectData="query.fdLoginName"
              @confirm="query.fdLoginName = $event"
            />
          </p-switch-form-item>
          <p-form-model-item label="部门">
            <p-select-org
              placeholder="请选择"
              :max="1"
              orgType="1"
              :selectData="query.fdDeptCode"
              @confirm="query.fdDeptCode = $event"
            />
          </p-form-model-item>

          <p-switch-form-item label="工号">
            <p-input v-model="query.userCode" placeholder="请输入" />
          </p-switch-form-item>
          <template slot="button">
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
        <p-tabs>
          <p-tab-pane key="clue-echart" tab="线索报表">
            <report-clue :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="project-echart" tab="项目报表"></p-tab-pane>
          <p-tab-pane key="consumer-echart" tab="客户报表"></p-tab-pane>
          <p-tab-pane key="order-echart" tab="订单报表"></p-tab-pane>
          <p-tab-pane key="detail" tab="报表详情"></p-tab-pane>
        </p-tabs>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import SelectBusiness from '@/views/components/select/business';
import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';

import ReportClue from './report-clue';

const listMixin = buildListMixin({
  properties: [
    'userCode',
    { key: 'createTime', value: [] },
    { key: 'fdLoginName', value: [] },
    { key: 'fdDeptCode', value: [] },
    { key: 'fdProvince', value: [] },
    { key: 'fdCity', value: [] },
    { key: 'fdBusinessCenter', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], fdLoginName = [], fdDeptCode = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      userCode: query.userCode,
      fdProvinceCode: (query.fdProvince[0] || {}).value,
      fdCityCode: (query.fdCity[0] || {}).value,
      fdBusinessCenter: (query.fdBusinessCenter[0] || {}).value,
      fdLoginName: (fdLoginName[0] || {}).uid,
      fdDeptCode: (fdDeptCode[0] || {}).code,
    };
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
});

export default {
  name: '团队汇总报表',
  mixins: [listMixin, commonMixin, formatMixin],
  components: {
    SelectProvince,
    SelectCity,
    SelectBusiness,
    ReportClue,
  },
  data() {
    return {
      reportQuery: {},
    };
  },
};
</script>
