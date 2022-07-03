<template>
  <p-modal
    :maskClosable="false"
    title="选择客户"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="1" :model="query">
        <p-switch-form-item label="客户名称">
          <p-input v-model="query.fdCustName" placeholder="请输入" />
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
            title: '客户名称',
            dataIndex: 'fdCustName',
          },
          {
            title: '业务员名称',
            dataIndex: 'fdUserName',
          },
          {
            title: '业务员账号',
            dataIndex: 'fdLoginName',
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
          <span v-if="!!selectedValue">
            已选择：{{ (selectedValue || {}).fdCustName }}
          </span>
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
  properties: ['fdCustName'],
  getQuery: (_, query) => {
    let targetQuery = {
      fdCustName: query.fdCustName,
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdStatus: _.status,
    };

    return targetQuery;
  },
  getData: (_, query) => {
    return api.customer.getCommonCustomerList(query);
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-customer',
  mixins: [selectionMixin, listMixin],
  props: {
    status: {
      type: String,
    },
  },
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
