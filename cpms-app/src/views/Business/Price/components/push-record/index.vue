<template>
  <block title="推送记录" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>推送时间</th>
            <th>推送系统</th>
            <th>推送状态</th>
            <th>原始实体参数</th>
            <th>请求参数</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDateTime(item.updateTime) }}</td>
              <td>{{ item.fdSystemFlag | fdSystemFlag }}</td>
              <td style="display: flex">
                <span style="margin: 5px 8px 0 0">
                  {{ item.fdStatus | fdStatus }}
                </span>
                <span v-if="item.fdStatus === 'fail'">
                  <van-button type="danger" native-type="button" size="mini" @click="handleErrorInfo(item)"
                    >查看错误信息</van-button
                  >
                </span>
              </td>
              <td>
                <van-button type="primary" size="mini" native-type="button" @click="handleEntityParameter(item)"
                  >查看详情参数</van-button
                >
              </td>
              <td>
                <van-button type="primary" size="mini" native-type="button" @click="handleRequestParameter(item)"
                  >查看详情参数</van-button
                >
              </td>
            </tr>
          </tbody>
          <template slot="fdSystemFlag" slot-scope="text">
            {{ text | fdSystemFlag }}
          </template>
        </table>

        <van-empty v-else image-size="100px" description="暂无推送记录" />
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
    limit: 999,
    fdModuleId: _.moduleId,
    fdModuleFlag: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdModuleId && !!query.fdModuleFlag
      ? api.common.getItfRecordList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export function fdSystemFlag(value) {
  switch (value) {
    case 'crm':
      return 'CRM系统';
    case 'ark':
      return '方舟系统';
    case 'cost':
      return '费控系统';
    default:
      return value;
  }
}

export function fdStatus(v) {
  switch (v) {
    case 'init':
      return '初始化';
    case 'success':
      return '推送成功';
    case 'fail':
      return '推送异常';
    case 'close':
      return '关闭不推送';
    default:
      return v;
  }
}

export default {
  name: 'push-record',
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  data() {
    return {};
  },
  components: {},
  methods: {
    handleErrorInfo(record) {
      this.$dialog
        .confirm({
          title: '错误信息',
          message: record.fdResponseMsg,
        })
        .then(() => {})
        .catch(() => {});
    },
    handleEntityParameter(record) {
      this.$dialog
        .confirm({
          title: '原始实体参数详情',
          message: record.fdRequestModel,
        })
        .then(() => {})
        .catch(() => {});
    },
    handleRequestParameter(record) {
      this.$dialog
        .confirm({
          title: '请求参数详情',
          message: record.fdRequestParam,
        })
        .then(() => {})
        .catch(() => {});
    },
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
    moduleFlag() {
      this.onRefresh();
    },
  },
  filters: {
    fdSystemFlag(value) {
      return fdSystemFlag(value);
    },
    fdStatus(v) {
      return fdStatus(v);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
