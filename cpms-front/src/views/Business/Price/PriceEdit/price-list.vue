<template>
  <block title="价格信息" theme="primary">
    <template v-slot:action>
      <p-button
        v-if="
          !readOnly &&
          (!moduleId || tempValue.fdStatus === 'draft' || tempValue.fdStatus === 'reject')
        "
        type="primary"
        @click="handleAdd"
      >
        新增价格信息
      </p-button>
    </template>
    <p-table
      :scroll="{ x: true }"
      style="margin-top: 16px"
      :columns="
        columns
          .concat([
            {
              title: '现净供价(元)',
              dataIndex: 'fdCurrentNetSupplyPrice',
              customRender: (text, recode) =>
                typeof recode.fdCurrentNetSupplyPrice === 'number'
                  ? formatAmount(text)
                  : '',
            },
            {
              title: '申请净供价(元)',
              dataIndex: 'fdApplyForNetContribution',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '单台价差(元)',
              dataIndex: 'fdSinglePrice',
              customRender: (text, recode) =>
                typeof recode.fdCurrentNetSupplyPrice === 'number'
                  ? formatAmount(text)
                  : '',
            },
            {
              title: '实际开单价(元)',
              dataIndex: 'fdActualOrderPrice',
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
              title: '单台项目费用(元)',
              dataIndex: 'fdSingleProjectCost',
              customRender: (text, recode) => formatAmount(recode.fdSingleProjectCost),
            },
            {
              title: '开单总金额(元)',
              dataIndex: 'fdTotalAmount',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '总项目费用(元)',
              dataIndex: 'fdTotalProjectCost',
              customRender: (text, recode) => formatAmount(text),
            },
            {
              title: '总申请价格资源(元)',
              dataIndex: 'fdTotalApplyPriceAssets',
              customRender: (text, recode) =>
                typeof recode.fdCurrentNetSupplyPrice === 'number'
                  ? formatAmount(text)
                  : '',
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
      :data-source="tempValue.priceMessageListAddParams"
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
          >
            编辑
          </p-button-link>
          <p-popconfirm
            v-if="
              !record.id ||
              tempValue.fdStatus === 'draft' ||
              tempValue.fdStatus === 'reject'
            "
            title="是否确认删除当前行数据?"
            @confirm="handleDel(record, index)"
          >
            <p-button-link>删除</p-button-link>
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

    <setting-price
      :defaultFdProductName="defaultFdProductName"
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChange"
    />
  </block>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingPrice from './setting-price';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    priceMessageListAddParams: [],
  },
});

export default {
  name: 'price-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingPrice,
  },
  props: {
    moduleId: {
      type: String,
    },
    defaultFdProductName: {
      type: String,
    },
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
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
      this.tempValue.priceMessageListAddParams = [
        ...this.tempValue.priceMessageListAddParams,
      ];
      this.onOk();
    },
    handleEdit(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleDel(value, index) {
      this.tempValue.priceMessageListAddParams.splice(index, 1);
      this.handleOk();
    },
    handleAbandonItem(value, index) {
      // await api.business.putProjectStakeholderInvalid(value.id);
      this.tempValue.priceMessageListAddParams[index] = {
        ...value,
        fdIsValid: '0',
      };
      this.handleOk();
    },
    handleChange(value) {
      // 如果下标大于等于0说明是编辑，否则是新增
      if (this.itemIndex > -1) {
        this.tempValue.priceMessageListAddParams[this.itemIndex] = value;
      } else {
        this.tempValue.priceMessageListAddParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>
