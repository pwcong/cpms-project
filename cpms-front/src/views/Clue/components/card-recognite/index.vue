<template>
  <p-modal
    :maskClosable="false"
    title="名片识别"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <div>
      <p-switch-form :col="2" :model="query">
        <p-switch-form-item label="名片图片">
          <p-upload
            name="file"
            action="/api/cpms/baseCard/readCard"
            :file-list="tempValue.card"
            @change="handleChange"
            accept="image/png, image/jpeg"
          >
            <div v-if="tempValue.card.length <= 0">
              <p-button>
                <p-icon type="upload" />
                <span>点击上传</span>
              </p-button>
            </div>
          </p-upload>
        </p-switch-form-item>
        <p-switch-form-item label="">
          <p-input v-model="query.keyword" placeholder="请输入关键字搜索" />
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
          selectedRowKeys: tempValue.value.map((d) => d.id),
          onChange: onSelectChange,
        }"
        rowKey="id"
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
      <p-button @click="onCancel">取 消</p-button>
      <p-button :disabled="tempValue.value <= 0" type="primary" @click="handleSubmit">
        确 定
      </p-button>
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
  valueType: 'OBJECT',
  defaultValue: {
    card: [],
    value: [],
  },
});

export default {
  name: 'card-recognite',
  mixins: [selectionMixin, listMixin],
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
  methods: {
    handleChange(e) {
      this.tempValue.card = e.fileList.map((d) => ({
        ...((d.response || {}).data || {}),
        ...d,
      }));
      this.query.keyword = (this.tempValue.card[0] || {}).company;
    },
    onSelectChange(selectedRowKeys) {
      const key = selectedRowKeys.pop();

      if (!!key) {
        this.tempValue.value = this.list.filter((d) => key === d.id);
      } else {
        this.tempValue.value = [];
      }
    },
    handleSubmit() {
      this.onOk();
    },
  },
};
</script>
