<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>商机管理</p-breadcrumb-item>
            <p-breadcrumb-item>项目查重</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="项目名称">
            <p-input v-model="query.fdName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="所在省市">
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
          <!-- <p-switch-form-item label="客户/代理商">
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
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="更新时间">
            <p-range-picker v-model="query.updateTime" />
          </p-switch-form-item> -->
          <template slot="button">
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
          :columns="[
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
            },
            {
              title: '项目名称',
              dataIndex: 'fdName',
              width: 300,
            },
            {
              title: '相似度',
              dataIndex: 'fdSimilarity',
              customRender: (text, record, index) =>
                `${getAmount(record.fdSimilarity * 100)}%`,
            },
          ]"
          :data-source="list.slice(0, 10)"
          bordered
          :pagination="false"
          @change="(pageNo = $event.current) && (pageSize = $event.pageSize)"
        >
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

import SelectProjectType from '../components/select/project-type';
import ProjectCounter from '../ProjectList/project-counter';
import SelectCustomer from '@/views/components/select/customer';
import SelectProductLine from '@/views/components/select/product-line';
import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';

const listMixin = buildListMixin({
  properties: [
    'fdName',
    'isFilter',
    { key: 'fdCustMainId', value: [] },
    { key: 'fdProjectTypeId', value: [] },
    { key: 'fdProductLine', value: [] },
    { key: 'createTime', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdProvince', value: [] },
    { key: 'fdCity', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], updateTime = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdName: query.fdName,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectTypeId: (query.fdProjectTypeId[0] || {}).value,
      fdProductLine: (query.fdProductLine[0] || {}).value,
      fdProvince: (query.fdProvince[0] || {}).value,
      fdCity: (query.fdCity[0] || {}).value,
      isFilter: query.isFilter === '1' ? '1' : undefined,
    };

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

    return targetQuery;
  },
  getData: (_, query) => {
    return api.business.getProjectCheckList(query);
  },
});

export default {
  name: '项目查重',
  mixins: [listMixin, formatMixin],
  components: {
    SelectProjectType,
    SelectCustomer,
    SelectProductLine,
    ProjectCounter,
    SelectProvince,
    SelectCity,
  },

  created() {
    const { fdName, source } = this.$route.query;

    !!fdName && (this.query.fdName = fdName);

    if (source === 'OA') {
      this.query.isFilter = '1';
    }
  },
};
</script>

<style lang="scss" scoped></style>
