<template>
  <block title="产品信息" theme="primary">
    <template v-slot:action>
      <p-button
        v-if="
          !readOnly &&
          (!moduleId || tempValue.fdStatus === 'draft' || tempValue.fdStatus === 'reject')
        "
        type="primary"
        @click="handleAdd"
      >
        新增产品信息
      </p-button>
    </template>
    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="
        columns
          .concat([
            {
              title: '产品单价(元)',
              dataIndex: 'fdProductUnitPrice',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '安装费(元)',
              dataIndex: 'fdInstallCost',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '上楼费(元)',
              dataIndex: 'fdUpstairsCost',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '运费(元)',
              dataIndex: 'fdFreight',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '合计单价(元)',
              dataIndex: 'fdTotalUnitPrice',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '总金额(元)',
              dataIndex: 'fdTotalAmount',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '交货计划',
              dataIndex: 'fdDeliveryPlan',
              customRender: (text, recode) => formatDate(text),
            },
          ])
          .concat(
            readOnly
              ? []
              : [
                  {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 100,
                    fixed: 'right',
                    scopedSlots: { customRender: 'operation' },
                  },
                ]
          )
      "
      :data-source="tempValue.contractPriceAddParamLists"
      :pagination="false"
      bordered
    >
      <template slot="fdIsValid" slot-scope="text, record">
        {{ record.fdIsValid === '0' ? '否' : '是' }}
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <span>
          <p-button-link
            v-if="
              !record.id ||
              tempValue.fdStatus === 'draft' ||
              tempValue.fdStatus === 'reject'
            "
            @click="handleEdit(record, index)"
            >编辑</p-button-link
          >
          <p-popconfirm
            v-if="
              !record.id ||
              tempValue.fdStatus === 'draft' ||
              tempValue.fdStatus === 'reject'
            "
            title="确认删除当前行数据?"
            @confirm="handleDel(record, index)"
          >
            <p-button-link> 删除 </p-button-link>
          </p-popconfirm>
          <!-- <template v-else>
            <p-popconfirm
              v-if="record.fdIsValid !== '0'"
              title="是否确认废弃当前行数据?"
              @confirm="handleAbandonItem(record, index)"
            >
              <p-button-link>废弃</p-button-link>
            </p-popconfirm>
          </template> -->
        </span>
      </template>
    </p-table>
    <setting-contact
      :moduleId="moduleId"
      :value="contractDetailValue"
      :visible.sync="contractDetailVisible"
      :mode="contractDetailIndex > -1 ? 'edit' : 'add'"
      @change="handleChange"
    />
  </block>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingContact from './setting-contract';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    contractPriceAddParamLists: [],
  },
});

export default {
  name: 'contract-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingContact,
  },
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      contractDetailVisible: false,
      contractDetailValue: {},
      contractDetailIndex: -1,
      columns: [
        {
          title: '序号',
          width: 50,
          fixed: 'left',
          dataIndex: 'index',
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '产品线',
          dataIndex: 'fdProductLineName',
        },
        {
          title: '产品类型',
          dataIndex: 'fdProductCategoryName',
        },
        {
          title: '产品型号',
          dataIndex: 'fdProductName',
        },
        {
          title: '产品编码',
          dataIndex: 'fdProductId',
        },
        {
          title: '数量',
          dataIndex: 'fdQuantity',
        },
      ].concat(
        !this.moduleId
          ? []
          : [
              // {
              //   title: '已占用',
              //   dataIndex: 'fdApplyCount',
              //   customRender: (text, record) => `${record.fdApplyCount}`,
              // },
              // {
              //   title: '可用',
              //   dataIndex: 'fdAvailable',
              //   customRender: (text, record) => `${record.fdAvailable}`,
              // },
            ]
      ),
    };
  },
  methods: {
    handleAdd() {
      this.handleEdit({}, -1);
    },
    handleOk() {
      this.tempValue.contractPriceAddParamLists = [
        ...this.tempValue.contractPriceAddParamLists,
      ];
      this.onOk();
    },
    handleDel(value, index) {
      this.tempValue.contractPriceAddParamLists.splice(index, 1);
      this.handleOk();
    },
    handleEdit(value, index) {
      this.contractDetailValue = { ...value };
      this.contractDetailIndex = index;
      this.contractDetailVisible = true;
    },
    handleAbandonItem(value, index) {
      // await api.business.putProjectStakeholderInvalid(value.id);
      this.tempValue.contractPriceAddParamLists[index] = {
        ...value,
        fdIsValid: '0',
      };
      this.handleOk();
    },
    handleChange(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.contractDetailIndex > -1) {
        this.tempValue.contractPriceAddParamLists[this.contractDetailIndex] = value;
      } else {
        this.tempValue.contractPriceAddParamLists.push(value);
      }
      this.onOk();
    },
  },
};
</script>
