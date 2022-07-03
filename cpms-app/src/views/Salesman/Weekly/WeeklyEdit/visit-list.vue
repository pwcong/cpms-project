<template>
  <block title="下周计划" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.visitList.length > 0">
          <thead>
            <th>序号</th>
            <th>拜访类型</th>
            <th>拜访方式</th>
            <th>客户/项目/线索名称</th>
            <th>拜访人姓名</th>
            <th>拜访人职务</th>
            <th>拜访人电话</th>
            <th>拜访目的</th>
            <th>拜访地址</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.visitList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <dict-text
                  placeholder="请选择"
                  dictCode="cpms_visit_type"
                  systemCode="cpms"
                  :value="(item.fdVisitType || '').split(',')"
                />
              </td>
              <td>
                <dict-text
                  placeholder="请选择"
                  dictCode="cpms_visit_way"
                  systemCode="cpms"
                  :value="(item.fdVisitWay || '').split(',')"
                />
              </td>
              <td>{{ item.fdModuleType }}</td>
              <td>{{ item.fdVisitName }}</td>
              <td>{{ item.fdVisitJob }}</td>
              <td>{{ item.fdVisitMobile }}</td>
              <td>{{ item.fdVisitPurpose }}</td>
              <td>{{ item.fdVisitAddress }}</td>
              <td v-if="!readonly && !item.id">
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
          + 添加拜访计划
        </van-button>
      </div>
    </div>

    <setting-visit :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingVisit from './setting-visit';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    visitList: [],
  },
});
export default {
  name: 'visit-list',
  mixins: [selectionMixin],
  components: {
    SettingVisit,
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
      this.tempValue.visitList = [...this.tempValue.visitList];
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
          this.tempValue.visitList.splice(index, 1);
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.visitList[this.itemIndex] = value;
      } else {
        this.tempValue.visitList.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
