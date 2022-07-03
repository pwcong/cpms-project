<template>
  <block theme="primary" title="本周销售任务达成">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.salesLists.length > 0">
          <thead>
            <th>月份</th>
            <th>商务中心</th>
            <th>产品线</th>
            <th>销售任务（万）</th>
            <th>实际收入（万）</th>
            <th>完成率</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.salesLists" :key="index">
              <td>{{ item.fdMonth }}</td>
              <td>{{ item.fdBusinessCenterName }}</td>
              <td>{{ item.fdProductLineName }}</td>
              <td>{{ item.fdSalesTask }}</td>
              <td>{{ item.fdRealizedIncome }}</td>
              <td>{{ item.fdPercentageComplete }}%</td>
              <td v-if="!readonly">
                <van-button type="primary" size="mini" native-type="button" @click="handleEditItem(item, index)">
                  编辑
                </van-button>
                <van-button type="danger" size="mini" native-type="button" @click="handleDelItem(item, index)">
                  删除
                </van-button>
              </td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>

      <div class="table-footer" v-if="!readonly">
        <van-button block size="mini" plain type="danger" native-type="button" @click="handleAddItem">
          + 添加销售任务达成
        </van-button>
      </div>
    </div>

    <setting-sales :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSales from './setting-sales';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    salesLists: [],
  },
});
export default {
  name: 'sales-list',
  mixins: [selectionMixin],
  components: {
    SettingSales,
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
    };
  },
  methods: {
    handleOk() {
      this.tempValue.salesLists = [...this.tempValue.salesLists];
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
          this.tempValue.salesLists.splice(index, 1);
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.salesLists[this.itemIndex] = value;
      } else {
        this.tempValue.salesLists.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
