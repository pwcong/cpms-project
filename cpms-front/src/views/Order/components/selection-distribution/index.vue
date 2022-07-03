<template>
  <p-modal
    :maskClosable="false"
    title="选择配送地址"
    :visible="visible"
    width="1000px"
    @cancel="onCancel"
  >
    <p-switch-form :col="1" :model="query">
      <p-switch-form-item label=""> </p-switch-form-item>
      <template slot="button">
        <p-button type="primary" @click="onRefresh(true)" icon="search" />
      </template>
    </p-switch-form>
    <p-table
      style="margin-top: 8px"
      :row-selection="{
        type: 'radio',
        selectedRowKeys: (tempValue || []).map((d) => d.id),
        onChange: onSelectChange,
      }"
      rowKey="id"
      :loading="loading"
      :columns="[
        {
          title: '姓名',
          dataIndex: 'contacts',
        },
        {
          title: '电话',
          dataIndex: 'contactsPhone',
        },
        {
          title: '身份证号',
          dataIndex: 'identityCard',
        },
        {
          title: '配送区域',
          dataIndex: 'provinceName',
          customRender: (text, v) => v.provinceName + v.cityName + v.districtName,
        },
        {
          title: '详细地址',
          dataIndex: 'detailAddress',
        },
      ]"
      :data-source="list"
      :pagination="{
        current: currentNo,
        pageSize: currentSize,
        pageSizeOptions: ['10', '20', '30', '50'],
        total: list.length,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共有 ${total} 条数据`,
      }"
      @change="(currentNo = $event.current) && (currentSize = $event.pageSize)"
      bordered
    >
    </p-table>

    <setting-site
      :needIdentityCard="mode === 'rdc'"
      :crmCode="crmCode"
      :visible.sync="siteVisible"
      @change="handleAdd"
    />

    <span slot="footer">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        "
      >
        <span>
          未找到配送地址?
          <p-button-link @click="siteVisible = true">新增一条 </p-button-link>
        </span>
        <span>
          <p-button @click="onCancel"> 取 消 </p-button>
          <p-button
            :disabled="tempValue.length <= 0"
            type="primary"
            @click="handleSubmit"
          >
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
import SettingSite from './setting-site';

export const EMode = {
  default: 'default',
  rdc: 'rdc',
};

const listMixin = buildListMixin({
  relation: ['crmCode', 'visible'],
  getData: (_, query) => {
    _.currentNo = 1;

    if (!_.crmCode || !_.visible) {
      return Promise.resolve({
        data: [],
      });
    }

    return api.order
      .getFindCreAdress({
        pageNo: 1,
        limit: 1000,
        crmCode: _.crmCode,
        // crmCode: 'C9184458',
      })
      .then((data) => {
        return {
          data: data.map((d, i) => ({
            ...d,
            id: i,
          })),
        };
      });
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-dictribution',
  mixins: [selectionMixin, listMixin],
  props: {
    moduleId: {
      type: String,
    },
    crmCode: {
      type: String,
    },
  },
  components: {
    SettingSite,
  },
  data() {
    return {
      siteVisible: false,
      currentNo: 1,
      currentSize: 10,
    };
  },
  computed: {
    selectedValue() {
      return this.tempValue[0];
    },
  },
  methods: {
    handleAdd(item) {
      this.onRefresh(true);
      this.tempValue = [item];
      this.onOk();
    },
    onSelectChange(selectedRowKeys) {
      this.tempValue = this.list.filter((d) => selectedRowKeys.indexOf(d.id) > -1);
    },
    async handleSubmit() {
      this.onOk();
    },
  },
};
</script>
