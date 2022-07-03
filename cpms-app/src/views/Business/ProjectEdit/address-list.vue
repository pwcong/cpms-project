<template>
  <block theme="primary" title="项目地址">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.addressListParams.length > 0">
          <thead>
            <th>序号</th>
            <th>项目施工地址</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.addressListParams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdDetailAddress }}</td>
              <td>{{ item.fdIsValid === '0' ? '否' : '是' }}</td>
              <td v-if="!readonly">
                <van-button
                  type="primary"
                  size="mini"
                  native-type="button"
                  @click="handleEditItem(item, index)"
                  v-if="!item.id || tempValue.fdProjectStatus === 'draft'"
                >
                  编辑
                </van-button>

                <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  @click="handleDelItem(item, index)"
                  v-if="!item.id || tempValue.fdProjectStatus === 'draft'"
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
        <van-button plain block type="danger" icon="plus" size="mini" native-type="button" @click="handleAddItem">
          新增项目地址
        </van-button>
      </div>
    </div>

    <setting-address
      :list="tempValue.addressListParams"
      :index="itemIndex"
      :moduleId="moduleId"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      :value="itemValue"
      :visible.sync="itemVisible"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingAddress from './setting-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressListParams: [],
  },
});
export default {
  name: 'address-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
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
      this.tempValue.addressListParams = [...this.tempValue.addressListParams];
      this.onOk();
    },
    handleAddItem() {
      this.handleEditItem(
        {
          fdIsValid: '1',
        },
        -1
      );
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
          this.tempValue.addressListParams.splice(index, 1);
          this.handleOk();
        });
    },
    async handleAbandonItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认废弃该行数据?',
        })
        .then(async () => {
          this.tempValue.addressListParams[index] = {
            ...value,
            fdIsValid: '0',
            fdIsUpdate: '1',
          };
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.addressListParams[this.itemIndex] = value;
      } else {
        this.tempValue.addressListParams.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
