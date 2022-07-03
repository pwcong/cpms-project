<template>
  <block theme="primary" title="价格信息">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.priceMessageListAddParams">
          <thead>
            <th>序号</th>
            <th>产品线</th>
            <th>产品类型</th>
            <th>产品型号</th>
            <th>数量</th>
            <th>现净供价(元)</th>
            <th>申请净供价(元)</th>
            <th>单台价差(元)</th>
            <th>实际开单价(元)</th>
            <th>安装费(元)</th>
            <th>上楼费(元)</th>
            <th>单台项目费用(元)</th>
            <th>开单总金额(元)</th>
            <th>总项目费用(元)</th>
            <th>总申请价格资源(元)</th>
            <th>交货计划</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.priceMessageListAddParams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdProductLineName }}</td>
              <td>{{ item.fdProductCategoryName }}</td>
              <td>{{ item.fdProductName }}</td>
              <td>{{ item.fdQuantity }}</td>
              <td>{{ formatAmount(item.fdCurrentNetSupplyPrice) }}</td>
              <td>{{ formatAmount(item.fdApplyForNetContribution) }}</td>
              <td>{{ formatAmount(item.fdSinglePrice) }}</td>
              <td>{{ formatAmount(item.fdActualOrderPrice) }}</td>
              <td>{{ formatAmount(item.fdInstallCost) }}</td>
              <td>{{ formatAmount(item.fdUpstairsCost) }}</td>
              <td>{{ formatAmount(item.fdSingleProjectCost) }}</td>
              <td>{{ formatAmount(item.fdTotalAmount) }}</td>
              <td>{{ formatAmount(item.fdTotalProjectCost) }}</td>
              <td>{{ formatAmount(item.fdTotalApplyPriceAssets) }}</td>
              <td>{{ item.fdDeliveryPlan | planTime }}</td>
              <td v-if="!item.id || tempValue.fdStatus === 'draft' || tempValue.fdStatus === 'reject'">
                <van-button type="primary" size="mini" native-type="button" @click="handleEditItem(item, index)"
                  >编辑</van-button
                >
                <van-button type="danger" size="mini" native-type="button" @click="handleDelItem(item, index)"
                  >删除</van-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="table-footer"
        v-if="!readonly && (!moduleId || tempValue.fdStatus === 'draft' || tempValue.fdStatus === 'reject')"
      >
        <van-button plain block type="danger" icon="plus" size="mini" native-type="button" @click="handleAddItem">
          新增价格明细
        </van-button>
      </div>
    </div>
    <setting-price
      :defaultFdProductName="defaultFdProductName"
      :moduleId="moduleId"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      @change="handleChangeItem"
    >
    </setting-price>
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
  props: {
    readonly: {
      type: Boolean,
    },
    moduleId: {
      type: String,
    },
    defaultFdProductName: {
      type: String,
    },
  },
  components: {
    SettingPrice,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
      active: 2,
    };
  },
  filters: {
    planTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(v).format('YYYY-MM-DD');
    },
  },
  methods: {
    handleOk() {
      this.tempValue.priceMessageListAddParams = [...this.tempValue.priceMessageListAddParams];
      this.onOk();
    },
    handleAddItem() {
      this.handleEditItem({}, -1);
    },
    handleEditItem(value, index) {
      this.itemValue = { ...value };
      this.itemIndex = index;
      this.itemVisible = true;
    },
    handleDelItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认删除该行数据?',
        })
        .then(async () => {
          this.tempValue.priceMessageListAddParams.splice(index, 1);
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      value = {
        ...value,
        fdCurrentNetSupplyPrice: Number(value.fdCurrentNetSupplyPrice), //现净供价
        fdApplyForNetContribution: Number(value.fdApplyForNetContribution), //申请净供价
        fdActualOrderPrice: Number(value.fdActualOrderPrice), //实际开单价
        fdInstallCost: Number(value.fdInstallCost), //安装费
        fdUpstairsCost: Number(value.fdUpstairsCost), //上楼费
        fdSingleProjectCost: Number(value.fdSingleProjectCost), //单台项目费 4位小数
      };
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
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

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
