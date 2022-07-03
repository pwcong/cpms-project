<template>
  <block theme="primary" title="产品信息">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.contractPriceAddParamLists">
          <thead>
            <th>序号</th>
            <th>产品线</th>
            <th>产品类型</th>
            <th>产品型号</th>
            <th>数量</th>
            <th>产品单价(元)</th>
            <th>安装费(元)</th>
            <th>上楼费(元)</th>
            <th>运费(元)</th>
            <th>合计单价(元)</th>
            <th>总金额(元)</th>
            <th>交货计划</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.contractPriceAddParamLists" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdProductLineName }}</td>
              <td>{{ item.fdProductCategoryName }}</td>
              <td>{{ item.fdProductName }}</td>
              <td>{{ item.fdQuantity }}</td>
              <td>{{ formatAmount(item.fdProductUnitPrice) }}</td>
              <td>{{ formatAmount(item.fdInstallCost) }}</td>
              <td>{{ formatAmount(item.fdUpstairsCost) }}</td>
              <td>{{ formatAmount(item.fdFreight) }}</td>
              <td>{{ formatAmount(item.fdTotalUnitPrice) }}</td>
              <td>{{ formatAmount(item.fdTotalAmount) }}</td>
              <td>{{ item.fdDeliveryPlan | planTime }}</td>
              <td v-if="!readonly">
                <van-button type="primary" size="small" @click="handleEditItem(item, index)">编辑</van-button>
                <van-button type="danger" size="small" @click="handleDelItem(item, index)">删除</van-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-footer" v-if="!readonly">
        <van-button plain block type="danger" icon="plus" size="small" native-type="button" @click="handleAddItem">
          新增产品明细
        </van-button>
      </div>
    </div>
    <setting-contract :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem"> </setting-contract>
  </block>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingContract from './setting-contract';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    contractPriceAddParamLists: [],
  },
});
export default {
  name: 'contract-list',
  mixins: [selectionMixin, formatMixin],
  props: {
    readonly: {
      type: Boolean,
    },
    moduleId: {
      type: String,
    },
  },
  components: {
    SettingContract,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  filters: {
    planTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(new Date(v)).format('YYYY-MM-DD');
    },
  },
  methods: {
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
          this.tempValue.contractPriceAddParamLists.splice(index, 1);
          this.tempValue.contractPriceAddParamLists = [...this.tempValue.contractPriceAddParamLists];
          this.onOk();
        });
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.contractPriceAddParamLists[this.itemIndex] = value;
      } else {
        this.tempValue.contractPriceAddParamLists.push(value);
      }
      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
