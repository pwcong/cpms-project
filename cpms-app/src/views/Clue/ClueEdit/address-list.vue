<template>
  <block theme="primary" title="客户办公地址">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.addressList.length > 0">
          <thead>
            <th>序号</th>
            <th>客户办公地址</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.addressList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdDetailaddress }}</td>
              <td>{{ item.fdIsValid === '0' ? '否' : '是' }}</td>
              <td v-if="!readonly">
                <van-button
                  v-if="!item.id || tempValue.fdClueStatus === 'draft'"
                  type="primary"
                  size="mini"
                  native-type="button"
                  @click="handleEditItem(item, index)"
                >
                  编辑
                </van-button>
                <van-button
                  v-if="!item.id || tempValue.fdClueStatus === 'draft'"
                  type="danger"
                  size="mini"
                  native-type="button"
                  @click="handleDelItem(item, index)"
                >
                  删除
                </van-button>
                <template v-else>
                  <van-button
                    v-if="item.fdIsValid !== '0'"
                    type="danger"
                    size="mini"
                    native-type="button"
                    @click="handleAbandonItem(item, index)"
                  >
                    废弃
                  </van-button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>

      <div class="table-footer" v-if="!readonly">
        <van-button block size="mini" plain type="danger" native-type="button" @click="handleAddItem">
          + 添加客户办公地址
        </van-button>
      </div>
    </div>

    <setting-address :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingAddress from './setting-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressList: [],
  },
});
export default {
  name: 'address-list',
  mixins: [selectionMixin],
  components: {
    SettingAddress,
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
      this.tempValue.addressList = [...this.tempValue.addressList];
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
          this.tempValue.addressList.splice(index, 1);
          this.handleOk();
        });
    },

    async handleAbandonItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认废弃该行数据?',
        })
        .then(async () => {
          this.tempValue.addressList[index] = {
            ...value,
            fdIsValid: '0',
          };
          this.handleOk();
        });
    },

    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.addressList[this.itemIndex] = value;
      } else {
        this.tempValue.addressList.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
