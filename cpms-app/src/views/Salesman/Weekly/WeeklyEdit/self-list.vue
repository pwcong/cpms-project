<template>
  <block theme="primary" title="本周个人销售达成">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.selfLists.length > 0">
          <thead>
            <th>产品线</th>
            <th>实际收入（万）</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.selfLists" :key="index">
              <td>{{ item.fdProductLineName }}</td>
              <td>{{ item.fdRealizedIncome }}</td>
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
          + 添加个人销售达成
        </van-button>
      </div>
    </div>

    <setting-self :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingSelf from './setting-self';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    selfLists: [],
  },
});
export default {
  name: 'self-list',
  mixins: [selectionMixin],
  components: {
    SettingSelf,
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
      this.tempValue.selfLists = [...this.tempValue.selfLists];
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
          this.tempValue.selfLists.splice(index, 1);
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.selfLists[this.itemIndex] = value;
      } else {
        this.tempValue.selfLists.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
