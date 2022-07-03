<template>
  <block theme="primary" title="产品信息">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.productListParams.length > 0">
          <thead>
            <th>序号</th>
            <th>产品线</th>
            <th>产品类型</th>
            <th>产品型号</th>
            <th>数量</th>
            <th>预计销售单价(元)</th>
            <th>预售总金额(元)</th>
            <th>预出货日期</th>
            <th>备注/定制说明</th>
            <th>定制费承担方</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.productListParams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdProductLineName }}</td>
              <td>{{ item.fdProductCategoryName }}</td>
              <td>{{ item.fdProductName }}</td>
              <td>{{ item.fdNum }}</td>
              <td>{{ formatAmount(item.fdPrice) }}</td>
              <td>{{ formatAmount(item.fdTotalSum) }}</td>
              <td>{{ item.fdShippingDate }}</td>
              <td>{{ item.fdRemake }}</td>
              <td>{{ item.fdCustomFeeBearer }}</td>
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
          新增产品信息
        </van-button>
      </div>
    </div>

    <setting-product :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingProduct from './setting-product';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    productListParams: [],
  },
});
export default {
  name: 'product-list',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingProduct,
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
      this.tempValue.productListParams = [...this.tempValue.productListParams];
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
          this.tempValue.productListParams.splice(index, 1);
          this.handleOk();
        });
    },
    handleAbandonItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认废弃该行数据?',
        })
        .then(async () => {
          this.tempValue.productListParams[index] = {
            ...value,
            fdIsValid: '0',
            fdIsUpdate: '1',
          };
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.productListParams[this.itemIndex] = value;
      } else {
        this.tempValue.productListParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
