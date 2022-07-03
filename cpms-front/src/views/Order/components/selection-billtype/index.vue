<template>
  <p-modal
    :maskClosable="false"
    title="选择单据类型"
    :visible="visible"
    width="400px"
    @cancel="onCancel"
  >
    <p-table
      style="margin-top: 8px"
      :row-selection="{
        type: 'radio',
        selectedRowKeys: (tempValue || []).map((d) => d.value),
        onChange: onSelectChange,
      }"
      rowKey="value"
      :loading="loading"
      :columns="[
        {
          title: '单据类型',
          dataIndex: 'text',
        },
      ]"
      :data-source="list"
      :pagination="false"
      bordered
    >
    </p-table>

    <span slot="footer">
      <span>
        <p-button @click="onCancel"> 取 消 </p-button>
        <p-button :disabled="tempValue.length <= 0" type="primary" @click="handleSubmit">
          确 定
        </p-button>
      </span>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  relation: ['visible'],
  getData: (_, query) => {
    return api.common
      .getDictList({
        systemCode: 'cpms',
        dictCode: 'cpms_order_bill_type',
      })
      .then((res) => ({
        ...res,
        data: (res.data || []).map((d) => ({
          text: d.dataLabel,
          value: d.dataValue,
        })),
      }));
  },
});

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  name: 'selection-billtype',
  mixins: [selectionMixin, listMixin],
  methods: {
    onSelectChange(selectedRowKeys) {
      this.tempValue = this.list.filter((d) => selectedRowKeys.indexOf(d.value) > -1);
    },
    async handleSubmit() {
      this.onOk();
    },
  },
};
</script>
