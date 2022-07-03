<template>
  <block theme="primary" title="更新项目状态">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.custList.length > 0">
          <thead>
            <th>序号</th>
            <th>项目名称</th>
            <th>反馈内容</th>
            <th v-if="!readonly">操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.custList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdProjectName }}</td>
              <td>{{ item.fdProjectFeedback }}</td>
              <td v-if="!readonly">
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
          + 添加项目状态
        </van-button>
      </div>
    </div>

    <setting-project
      :customerId="tempValue.fdModuleTypeId"
      :value="itemValue"
      :visible.sync="itemVisible"
      @change="handleChangeItem"
    />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingProject from './setting-project';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    custList: [],
  },
});
export default {
  name: 'project-list',
  mixins: [selectionMixin],
  components: {
    SettingProject,
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
      this.tempValue.custList = [...this.tempValue.custList];
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
          this.tempValue.custList.splice(index, 1);
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      if (this.itemIndex > -1) {
        this.tempValue.custList[this.itemIndex] = value;
      } else {
        this.tempValue.custList.push(value);
      }

      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
