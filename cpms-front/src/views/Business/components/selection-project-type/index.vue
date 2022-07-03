<template>
  <p-modal
    :maskClosable="false"
    title="选择项目类型"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="2" :model="query">
        <p-switch-form-item label="">
          <p-input v-model="query.fdName" placeholder="请输入项目类型名称" />
        </p-switch-form-item>
        <template slot="button">
          <p-button type="primary" @click="onRefresh(false)" icon="search" />
        </template>
      </p-switch-form>
    </div>
    <div>
      <p-table
        :scroll="{ x: true }"
        :row-selection="{
          type: 'radio',
          selectedRowKeys: tempValue.map((d) => d.id),
          onChange: onSelectChange,
        }"
        rowKey="id"
        :loading="loading"
        :columns="[
          {
            title: '项目类型名称',
            dataIndex: 'fdName',
          },
          {
            title: '版本',
            dataIndex: 'fdVersion',
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
      </p-table>
    </div>
    <span slot="footer">
      <div style="display: flex; justify-content: space-between">
        <span>
          <span v-if="!!selectedValue"> 已选择：{{ (selectedValue || {}).fdName }} </span>
        </span>
        <span>
          <p-button @click="onCancel">取 消</p-button>
          <p-button :disabled="!selectedValue" type="primary" @click="handleSubmit">
            确 定
          </p-button>
        </span>
      </div>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  properties: ['fdName'],
  getQuery: (_, query) => ({ ...query, limit: query.pageSize }),
  getData: (_, query) => {
    return api.business.getNewProjectTypeList(query);
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-project-type',
  mixins: [selectionMixin, listMixin],
  computed: {
    selectedValue() {
      return this.tempValue[0];
    },
  },
  methods: {
    handleSubmit() {
      this.onOk();
    },
    onSelectChange(selectedRowKeys) {
      this.tempValue = this.list.filter((d) => selectedRowKeys.indexOf(d.id) > -1);
    },
  },
};
</script>
