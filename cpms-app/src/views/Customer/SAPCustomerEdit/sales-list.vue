<template>
  <block theme="primary" title="销售视图">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.custSapSaleListAddParamList.length > 0">
          <thead>
            <th>序号</th>
            <th>销售组织</th>
            <th>经营部-销售办公室</th>
            <th>客户组-市场级别</th>
            <th>一级渠道</th>
            <th>二级渠道</th>
            <th>三级渠道</th>
            <th>业务员ZB</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.custSapSaleListAddParamList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdSalesOrganization }}</td>
              <td>{{ item.fdSalesOffice }}</td>
              <td>{{ item.fdMarketLevel }}</td>
              <td>{{ item.fdChannelOneName }}</td>
              <td>{{ item.fdChannelTwoName }}</td>
              <td>{{ item.fdChannelThreeName }}</td>
              <td>{{ item.fdSalesMan }}</td>
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
                <!-- <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  v-if="!!moduleId && item.fdIsValid !== '0'"
                  @click="handleAbandonItem(item, index)"
                >
                  废弃
                </van-button> -->
                <van-button
                  type="danger"
                  size="mini"
                  native-type="button"
                  v-if="!moduleId || status === 'reject' || status === 'draft'"
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
          销售视图
        </van-button>
      </div>
    </div>

    <setting-sales
      :custSapCompanyListAddParamList="tempValue.custSapCompanyListAddParamList"
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
import SettingSales from './setting-sales';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custSapSaleListAddParamList: [],
  },
});
export default {
  name: 'sales-list',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    status: {
      type: String,
    },
  },
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
          this.tempValue.custSapSaleListAddParamList.splice(index, 1);
          this.tempValue.custSapSaleListAddParamList = [...this.tempValue.custSapSaleListAddParamList];
          this.onOk();
        });
    },
    handleChangeItem(value) {
      this.tempValue.custSapSaleListAddParamList = [...this.tempValue.custSapSaleListAddParamList];
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.custSapSaleListAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.custSapSaleListAddParamList.push(value);
      }
      this.tempValue.custSapSaleListAddParamList = [...this.tempValue.custSapSaleListAddParamList];
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
        this.tempValue.custSapSaleListAddParamList[index] = {
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
