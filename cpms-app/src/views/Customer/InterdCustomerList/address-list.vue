<template>
  <block theme="primary" title="客户办公地址">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.addressDtoList.length > 0">
          <thead>
            <th>序号</th>
            <th>客户办公地址</th>
            <th>创建人</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.addressDtoList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdDetailaddress }}</td>
              <td>{{ item.createByName }}</td>
              <td>{{ item.fdIsValid === '0' ? '废弃' : '有效' }}</td>
              <td v-if="!readonly">
                <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  v-if="
                    !!moduleId &&
                    item.fdIsValid !== '0' &&
                    (user.uid === item.createBy || user.uid === tempValue.fdLoginName)
                  "
                  @click="handleAbandonItem(item, index)"
                >
                  废弃
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
import { buildSelectionMixin, userMixin } from '@/mixins';
import SettingAddress from './setting-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    addressDtoList: [],
  },
});
export default {
  name: 'address-list',
  mixins: [selectionMixin, userMixin],
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
      fdLoginName: '', //业务员
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
    handleChangeItem(value) {
      this.tempValue.addressDtoList = [...this.tempValue.addressDtoList];
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.addressDtoList[this.itemIndex] = value;
      } else {
        this.tempValue.addressDtoList.push(value);
      }
      this.tempValue.addressDtoList = [...this.tempValue.addressDtoList];
      this.onOk();
    },
    // 废弃
    async handleAbandonItem(value, index) {
      const addressEditParamlist = [];
      const addressEditParamList = {
        ...value,
        fdMainId: this.moduleId,
      };
      addressEditParamlist.push(addressEditParamList);
      try {
        await api.customer.putCustomerOfficeAddressholderInvalid(addressEditParamlist);
      } catch (e) {
        console.error(e);
      } finally {
        this.$toast.success('操作成功');
        this.tempValue.addressDtoList[index] = {
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
