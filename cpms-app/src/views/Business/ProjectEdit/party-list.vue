<template>
  <block theme="primary" title="项目干系人">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.stakeholderListParams.length > 0">
          <thead>
            <th>序号</th>
            <th>人员归属</th>
            <th>姓名</th>
            <th>电话</th>
            <th>职务</th>
            <th>上级领导</th>
            <th>参与角色</th>
            <th>立场</th>
            <th>接触状态</th>
            <th>客情关系</th>
            <th>是否有效</th>
            <th v-if="!readonly">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.stakeholderListParams" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdPersonnelAttribution }}</td>
              <td>{{ item.fdName }}</td>
              <td>{{ item.fdMobile }}</td>
              <td>{{ item.fdPosition }}</td>
              <td>{{ item.fdSuperiors }}</td>
              <td>{{ item.fdRole }}</td>
              <td>{{ item.fdStandpoint }}</td>
              <td>{{ item.fdContactStatus }}</td>
              <td>{{ item.fdGuestRelationship }}</td>
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
          新增项目干系人
        </van-button>
      </div>
    </div>

    <setting-party :value="itemValue" :visible.sync="itemVisible" @change="handleChangeItem" />
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SettingParty from './setting-party';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    stakeholderListParams: [],
  },
});
export default {
  name: 'party-list',
  mixins: [selectionMixin],
  components: {
    SettingParty,
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
      this.tempValue.stakeholderListParams = [...this.tempValue.stakeholderListParams];
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
          this.tempValue.stakeholderListParams.splice(index, 1);
          this.handleOk();
        });
    },
    handleAbandonItem(value, index) {
      this.$dialog
        .confirm({
          title: '是否确认废弃该行数据?',
        })
        .then(async () => {
          this.tempValue.stakeholderListParams[index] = {
            ...value,
            fdIsValid: '0',
            fdIsUpdate: '1',
          };
          this.handleOk();
        });
    },
    handleChangeItem(value) {
      // 如果下标大于等于0说明是编辑数据，否则是新增数据
      if (this.itemIndex > -1) {
        this.tempValue.stakeholderListParams[this.itemIndex] = value;
      } else {
        this.tempValue.stakeholderListParams.push(value);
      }
      this.handleOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
