<template>
  <block theme="primary" title="其他联系人">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.otherContactsList.length > 0">
          <thead>
            <th>序号</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.otherContactsList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdContactName }}</td>
              <td>{{ item.fdContactPhone }}</td>
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
          + 添加其他联系人
        </van-button>
      </div>
    </div>

    <setting-contact :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingContact from './setting-contact';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    otherContactsList: [],
  },
});
export default {
  name: 'contact-list',
  mixins: [selectionMixin],
  components: {
    SettingContact,
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
      this.tempValue.otherContactsList = [...this.tempValue.otherContactsList];
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
          this.tempValue.otherContactsList.splice(index, 1);
          this.handleOk();
        });
    },
    async handleAbandonItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认废弃该行数据?',
        })
        .then(async () => {
          this.tempValue.otherContactsList[index] = {
            ...value,
            fdIsValid: '0',
          };
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.otherContactsList[this.itemIndex] = value;
      } else {
        this.tempValue.otherContactsList.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
