<template>
  <block theme="primary" title="客户办公地址">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.addressAddParamList.length > 0">
          <thead>
            <th>序号</th>
            <th>客户办公地址</th>
            <th>创建人</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.addressAddParamList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdDetailaddress }}</td>
              <td>{{ item.createByName }}</td>
              <td>{{ item.fdIsValid === '0' ? '废弃' : '有效' }}</td>
              <td v-if="!readonly">
                <van-button
                  type="primary"
                  size="mini"
                  native-type="button"
                  v-if="!moduleId || status === 'draft'"
                  @click="handleEditItem(item, index)"
                >
                  编辑
                </van-button>
                <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  v-if="!!moduleId && item.fdIsValid !== '0'"
                  @click="handleAbandonItem(item, index)"
                >
                  废弃
                </van-button>
                <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  v-if="!moduleId"
                  @click="handleDelItem(item, index)"
                >
                  删除
                </van-button>
              </td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
      <div class="table-footer" v-if="!readonly">
        <van-button plain block type="danger" icon="plus" size="mini" native-type="button" @click="handleAddItem">
          新增客户办公地址
        </van-button>
      </div>
    </div>

    <setting-address
      :value="itemValue"
      :moduleId="moduleId"
      :status="status"
      :visible.sync="itemVisible"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import SettingAddress from './setting-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressAddParamList: [],
  },
});
export default {
  name: 'address-list',
  mixins: [selectionMixin],
  props: {
    title: {
      type: Boolean,
    },
    moduleId: {
      type: String,
    },
    status: {
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
          this.tempValue.addressAddParamList.splice(index, 1);
          this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
          this.onOk();
        });
    },
    handleChangeItem(value) {
      this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.addressAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.addressAddParamList.push(value);
      }
      this.tempValue.addressAddParamList = [...this.tempValue.addressAddParamList];
      this.onOk();
    },
    // 废弃
    async handleAbandonItem(value, index) {
      const addressEditParamlist = [];
      const addressEditParamList = {
        ...value,
      };
      addressEditParamlist.push(addressEditParamList);
      try {
        await api.customer.putCustomerOfficeAddressholderInvalid(addressEditParamlist);
      } catch (e) {
        console.error(e);
      } finally {
        this.$toast.success('操作成功');
        this.tempValue.addressAddParamList[index] = {
          ...value,
          fdIsValid: '0',
        };
      }
      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
