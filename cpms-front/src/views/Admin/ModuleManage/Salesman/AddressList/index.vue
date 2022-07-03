<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务员模块</p-breadcrumb-item>
            <p-breadcrumb-item>考勤地址</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3">
          <p-switch-form-item label="打卡地址缩写">
            <p-input v-model="query.fdClockAddressAcronym" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="详细地址">
            <p-input v-model="query.fdClockAddress" placeholder="请输入" />
          </p-switch-form-item>
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
              dataIndex: 'index',
              width: 50,
              fixed: 'left',
              customRender: (text, record, index) => `${index + 1}`,
            },
            {
              title: '打卡地址缩写',
              sorter: true,
              dataIndex: 'fdClockAddressAcronym',
            },
            {
              title: '打卡地址',
              sorter: true,
              dataIndex: 'fdClockAddress',
            },
            {
              title: '打卡有效范围(米)',
              sorter: true,
              dataIndex: 'fdClockScope',
            },
            {
              title: '状态',
              dataIndex: 'fdIsValid',
              fixed: 'right',
              align: 'center',
              width: 50,
              scopedSlots: { customRender: 'fdIsValid' },
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 120,
              fixed: 'right',
              scopedSlots: { customRender: 'operation' },
            },
          ]"
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
          <template slot="fdIsValid" slot-scope="text, record">
            <status-tag :status="record.fdIsValid">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)">详情</p-button-link>
              <p-button-link @click="handleEdit(record.id)">编辑</p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin } from '@/mixins';
import userMixin from '@/mixins/user';
import api from '@/api';
import { buildTable4ListMixin } from '@/views/mixins';
import formMixin from '../AddressEdit/form';
const listMixin = buildListMixin({
  properties: [{ key: 'sorter', value: [] }, 'fdClockAddressAcronym', 'fdClockAddress'],

  getQuery: (_, query) => {
    const { sorter = [] } = query;
    let targetQuery = {
      fdClockAddressAcronym: query.fdClockAddressAcronym,
      fdClockAddress: query.fdClockAddress,
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
    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getClockAddressList(query);
  },
});

const tableMixin = buildTable4ListMixin();

export default {
  name: '考勤地址',
  mixins: [formMixin, listMixin, userMixin, tableMixin],
  methods: {},
  filters: {
    foramtStatus(v) {
      switch (v) {
        case '1':
          return '有效';
        default:
          return '无效';
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
