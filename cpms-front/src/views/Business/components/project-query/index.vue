<template>
  <p-modal
    :maskClosable="false"
    title="查看相似项目"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="2" :model="query">
        <p-switch-form-item label="项目名称">
          <p-input
            :readOnly="!searchable"
            v-model="query.fdName"
            :placeholder="!searchable ? undefined : '请输入'"
          />
        </p-switch-form-item>
        <template slot="button">
          <p-button type="primary" @click="onRefresh(false)" icon="search" />
        </template>
      </p-switch-form>
    </div>
    <div>
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
    <span slot="footer">
      <span>
        <p-button @click="onCancel">关 闭</p-button>
      </span>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  properties: ['fdName'],
  getQuery: (_, query) => ({ ...query, limit: query.pageSize }),
  getData: async (_, query) => {
    const result = query.fdName
      ? await api.business.getProjectCheckList(query)
      : Promise.resolve({
          data: [],
        });
    return result;
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'project-query',
  props: {
    projectName: String,
    searchable: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    projectName: {
      immediate: true,
      handler(v) {
        this.query.fdName = v;
      },
    },
  },
  mixins: [selectionMixin, listMixin, formatMixin],
};
</script>
