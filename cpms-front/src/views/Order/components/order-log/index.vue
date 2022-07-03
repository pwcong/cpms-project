<template>
  <p-modal
    :maskClosable="false"
    title="查看日志"
    :visible="visible"
    width="800px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-tabs>
        <p-tab-pane key="1" tab="推送记录">
          <push-record readOnly :visible="visible" :moduleNumber="moduleNumber" />
        </p-tab-pane>
        <p-tab-pane key="2" tab="更新记录">
          <updated-record readOnly :visible="visible" :moduleNumber="moduleNumber" />
        </p-tab-pane>
        <p-tab-pane key="3" tab="操作日志">
          <operation-log
            readOnly
            :visible="visible"
            :moduleId="moduleId"
            :moduleOrderId="
              (moduleOrderId || []).map((d) => {
                return d.id;
              })
            "
          />
        </p-tab-pane>
      </p-tabs>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">关 闭</p-button>
    </span>
  </p-modal>
</template>

<script>
import PushRecord from './push-record';
import UpdatedRecord from './updated-record';
import OperationLog from './operation-log';
import { buildSelectionMixin, userMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'order-log',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: {
      type: String,
    },
    moduleNumber: {
      type: String,
    },
    moduleOrderId: {
      type: Array,
    },
  },
  components: {
    PushRecord,
    UpdatedRecord,
    OperationLog,
  },
};
</script>
