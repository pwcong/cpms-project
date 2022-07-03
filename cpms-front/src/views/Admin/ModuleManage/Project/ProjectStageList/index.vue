<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>项目模块</p-breadcrumb-item>
            <p-breadcrumb-item>项目阶段</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="项目阶段名称">
            <p-input v-model="query.fdName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="默认完成比例">
            <p-input-number v-model="query.fdCompletePercentage" placeholder="请输入" />
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
              title: '项目阶段名称',
              dataIndex: 'fdName',
            },
            {
              title: '默认完成比例',
              dataIndex: 'fdCompletePercentage',
              customRender: (text, record) => `${record.fdCompletePercentage || '--'}%`,
            },
            {
              title: '操作',
              dataIndex: 'operation',
              fixed: 'right',
              width: 120,
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
            <p-button-link @click="handleDetail(record.id)">详情</p-button-link>
            <p-button-link @click="handleEdit(record.id)">编辑</p-button-link>
            <p-popconfirm
              title="是否确认删除当前行数据?"
              @confirm="handleDel(record, index)"
            >
              <p-button-link> 删除 </p-button-link>
            </p-popconfirm>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';

import formMixin from '../ProjectStageEdit/form';

const listMixin = buildListMixin({
  properties: ['fdName', 'fdCompletePercentage'],
  getQuery: (_, query) => {
    return {
      ...query,
      limit: query.pageSize,
    };
  },
  getData: (_, query) => {
    return api.business.getProjectStageList(query);
  },
});

export default {
  name: '项目阶段',
  mixins: [listMixin, formMixin],
  methods: {
    async handleDel(record) {
      await api.business.delProjectStage(record.id);
      this.$message.success('删除成功');
      this.onRefresh();
    },
  },
};
</script>

<style lang="scss" scoped>
.poros-switch-form {
  ::v-deep .poros-form-item-label {
    width: 90px;
  }
}
</style>
