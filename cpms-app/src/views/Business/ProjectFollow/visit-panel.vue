<template>
  <block title="拜访信息" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>拜访类型</th>
            <th>拜访名称</th>
            <th>拜访人</th>
            <th>拜访地址</th>
            <th>拜访目的</th>
            <th>打卡状态</th>
            <th>反馈状态</th>
            <th>操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <!-- {{ item.fdVisitType }} -->
                <dict-text dictCode="cpms_visit_type" systemCode="cpms" :value="(item.fdVisitType || '').split(',')" />
              </td>
              <td>{{ item.fdModuleType }}</td>
              <td>{{ item.fdVisitName }}</td>
              <td>{{ item.fdVisitAddress }}</td>
              <td>{{ item.fdVisitPurpose }}</td>
              <td>{{ item.fdClockCount | ClockCount }}</td>
              <td>{{ item.fdFeedbackCount | FeedbackCount }}</td>
              <td @click="handleDetail(item)" style="color: #e50113">详情</td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>
  </block>
</template>
<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdModuleTypeId: _.moduleId,
  }),
  getData: (_, query) => {
    return !!query.fdModuleTypeId
      ? api.salesman.getVisitByIdList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'visit-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Salesman/Visit/VisitDetail/${record.id}`,
      });
    },
  },
  filters: {
    FeedbackCount(v) {
      switch (v) {
        case 1:
          return '已反馈';
        default:
          return '未反馈';
      }
    },
    ClockCount(v) {
      switch (v) {
        case 1:
          return '已打卡';
        default:
          return '未打卡';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
