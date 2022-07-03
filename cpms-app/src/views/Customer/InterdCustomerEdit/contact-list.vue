<template>
  <block theme="primary" title="客户联系人">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.contactAddParamList.length > 0">
          <thead>
            <th>序号</th>
            <th>姓名</th>
            <th>职务</th>
            <th>手机号</th>
            <th>座机</th>
            <th>上级</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.contactAddParamList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdContactName }}</td>
              <td>{{ item.fdContactPost }}</td>
              <td>{{ item.fdContactMobile }}</td>
              <td>{{ item.fdContactPhone }}</td>
              <td>{{ item.fdContactLeaderName }}</td>
              <td>{{ item.fdIsValid === '0' ? '废弃' : '有效' }}</td>
              <td v-if="!readonly">
                <van-button
                  type="primary"
                  size="mini"
                  native-type="button"
                  v-if="item.fdIsValid !== '0'"
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
          新增客户联系人
        </van-button>
      </div>
    </div>

    <setting-contact
      :moduleId="moduleId"
      :status="status"
      :mode="itemIndex > -1 ? 'edit' : 'add'"
      :value="itemValue"
      :visible.sync="itemVisible"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import SettingContact from './setting-contact';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    contactAddParamList: [],
  },
});
export default {
  name: 'contact-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    contactList: {
      type: Array,
    },
    status: {
      type: String,
    },
  },
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
          this.tempValue.contactAddParamList.splice(index, 1);
          this.tempValue.contactAddParamList = [...this.tempValue.contactAddParamList];
          this.onOk();
        });
    },
    handleChangeItem(value) {
      this.tempValue.contactAddParamList = [...this.tempValue.contactAddParamList];
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.contactAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.contactAddParamList.push(value);
      }
      this.tempValue.contactAddParamList = [...this.tempValue.contactAddParamList];
      this.onOk();
    },
    // 废弃
    async handleAbandonItem(value, index) {
      const custContactEditParamList = [];
      const contactEditParamList = {
        fdContactName: value.fdContactName,
        fdContactPost: value.fdContactPost,
        id: value.id,
        version: value.version,
      };
      custContactEditParamList.push(contactEditParamList);
      try {
        await api.customer.putCustomerContactholderInvalid(custContactEditParamList);
      } catch (e) {
        console.error(e);
      } finally {
        this.$toast.success('操作成功');
        this.tempValue.contactAddParamList[index] = {
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
