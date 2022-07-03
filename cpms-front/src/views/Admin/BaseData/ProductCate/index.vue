<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>基础数据管理</p-breadcrumb-item>
            <p-breadcrumb-item>产品分类</p-breadcrumb-item>
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
          <p-switch-form-item label="产品分类">
            <p-input v-model="query.fdProductCategoryName" placeholder="请输入" />
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
              width: 50,
              fixed: 'left',
              dataIndex: 'index',
              customRender: (text, record, index) => `${index + 1}`,
            },
            {
              title: '产品分类',
              dataIndex: 'fdProductCategoryName',
            },

            {
              title: '操作',
              dataIndex: 'operation',
              fixed: 'right',
              width: 140,
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
          @change="(pageNo = $event.current) && (pageSize = $event.pageSize)"
        >
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleViewItem(record)"> 详情 </p-button-link>
              <!-- <p-button-link @click="handleEditItem(record, 'edit')">
                编辑
              </p-button-link> -->
              <!-- <p-button-link @click="handleDelItem(record)">删除</p-button-link> -->
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
import api from '@/api';
import { buildListMixin } from '@/mixins';

import SettingItem from './setting-item';

const listMixin = buildListMixin({
  properties: ['fdProductCategoryName'],
  getQuery: (_, query) => {
    return {
      ...query,
      limit: query.pageSize,
    };
  },
  getData: (_, query) => {
    return api.basedata.getProductCateList(query);
  },
});

export default {
  name: '产品分类',
  mixins: [listMixin],
  components: {
    SettingItem,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemMode: 'edit',
    };
  },
  methods: {
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
    async handleDelItem(value) {
      // TODO 删除数据
    },
  },
};
</script>

<style lang="scss" scoped></style>
