<template>
  <block title="跟进记录" theme="primary">
    <template #action>
      <van-button size="mini" type="danger" native-type="button" @click="handleAddItem"> 添加跟进记录 </van-button>
    </template>

    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>跟进人</th>
            <th>跟进人部门</th>
            <th>创建时间</th>
            <th>被拜访人</th>
            <th>被拜访职务</th>
            <th>被拜访人电话</th>
            <th>拜访地址</th>
            <th>跟进内容</th>
            <th>修改人</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdUserName }}</td>
              <td>{{ item.fdDeptName }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ item.fdVisitName }}</td>
              <td>{{ item.fdVisitJob }}</td>
              <td>{{ item.fdVisitMobile }}</td>
              <td>{{ item.fdAddress }}</td>
              <td>{{ item.fdProjectFeedback }}</td>
              <td>{{ item.updateBy }}</td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>

    <setting-follow
      :moduleId="moduleId"
      :moduleFlag="moduleFlag"
      :value="itemValue"
      :visible.sync="itemVisible"
      :mode="'add'"
      @change="onRefresh()"
    />
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import SettingFollow from './setting-follow';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: 999,
    fdRelateModuleId: _.moduleId,
    fdRelateModule: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdRelateModule && !!query.fdRelateModuleId
      ? api.common.getFollowRecord(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'follow-record',
  mixins: [listMixin, formatMixin],
  components: {
    SettingFollow,
  },
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  data() {
    return {
      itemValue: {},
      itemVisible: false,
    };
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
    moduleFlag() {
      this.onRefresh();
    },
  },
  methods: {
    handleAddItem() {
      this.itemValue = {};
      this.itemVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
