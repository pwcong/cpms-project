<template>
  <block theme="primary" title="公司代码视图">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.custSapCompanyListAddParamList.length > 0">
          <thead>
            <th>序号</th>
            <th>公司代码</th>
            <th>统御科目</th>
            <th>自动清账标识</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.custSapCompanyListAddParamList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdCompanySapCode }}</td>
              <td>{{ item.fdAccount }}</td>
              <td>
                <dict-text
                  :value="(item.fdClearAccount || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_sap_clear_account"
                />
              </td>
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
          新增公司代码视图
        </van-button>
      </div>
    </div>

    <setting-company
      :sapCustName="tempValue.fdSapCustName"
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
import SettingCompany from './setting-company';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custSapCompanyListAddParamList: [],
  },
});
export default {
  name: 'company-list',
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
    SettingCompany,
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
          this.tempValue.custSapCompanyListAddParamList.splice(index, 1);
          this.tempValue.custSapCompanyListAddParamList = [...this.tempValue.custSapCompanyListAddParamList];
          this.onOk();
        });
    },
    handleChangeItem(value) {
      this.tempValue.custSapCompanyListAddParamList = [...this.tempValue.custSapCompanyListAddParamList];
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.custSapCompanyListAddParamList[this.itemIndex] = value;
      } else {
        this.tempValue.custSapCompanyListAddParamList.push(value);
      }
      this.tempValue.custSapCompanyListAddParamList = [...this.tempValue.custSapCompanyListAddParamList];
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
        this.tempValue.custSapCompanyListAddParamList[index] = {
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
