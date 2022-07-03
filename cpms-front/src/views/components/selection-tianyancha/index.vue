<template>
  <p-modal
    :maskClosable="false"
    title="天眼查"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="1" :model="query">
        <p-switch-form-item label="关键字">
          <p-input v-model="query.keyword" placeholder="请输入" />
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
          selectedRowKeys: tempValue.map((d) => d.name),
          onChange: onSelectChange,
        }"
        rowKey="name"
        :loading="loading"
        :columns="[
          {
            title: '客户名称',
            dataIndex: 'name',
          },
          {
            title: '唯一识别码',
            dataIndex: 'creditCode',
          },
          {
            title: '营业状态',
            dataIndex: 'regStatus',
          },
        ]"
        :data-source="list"
        bordered
        :pagination="pagination"
        @change="
          (pagination.current = $event.current) && (pagination.pageSize = $event.pageSize)
        "
      >
      </p-table>
    </div>
    <span slot="footer">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        "
      >
        <span
          >注：搜索不到的企业请
          <a
            target="_blank"
            href="https://oateh.tcl.com/ekp/km/review/km_review_main/kmReviewMain.do?method=add&fdTemplateId=179b7db69a0a2fc9f147a214918995a5&s_css=default"
            >在此</a
          >
          创建，创建成功之后再在本页进行搜索，如军队、保密部门等。</span
        >
        <div>
          <p-button @click="onCancel">取 消</p-button>
          <p-button
            type="primary"
            :disabled="tempValue.length <= 0"
            @click="handleSubmit"
          >
            确 定
          </p-button>
        </div>
      </div>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  properties: ['keyword'],
  getData: (_, query) => {
    _.pagination.current = 1;
    return !!query.keyword
      ? api.common.getTianyanchaList(query.keyword)
      : Promise.resolve({
          data: [],
        });
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-tianyancha',
  mixins: [selectionMixin, listMixin],
  props: {
    validate: {
      type: Function,
      default: () => Promise.resolve(true),
    },
    keyword: {
      type: String,
    },
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: (total) => `共有 ${total} 条数据`,
      },
    };
  },
  watch: {
    keyword(v) {
      this.query.keyword = v;
    },
  },
  methods: {
    async handleSubmit() {
      const checked = await this.validate(this.tempValue);
      if (checked) {
        this.onOk();
      }
    },
    onSelectChange(selectedRowKeys) {
      const key = selectedRowKeys.pop();

      if (!!key) {
        this.tempValue = this.list.filter((d) => key === d.name);
      } else {
        this.tempValue = [];
      }
    },
  },
};
</script>
