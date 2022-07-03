<template>
  <block theme="primary" title="打卡记录">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.clockRecordMainDtos.length > 0">
          <thead>
            <th>序号</th>
            <th>姓名</th>
            <th>打卡地点</th>
            <th>打卡日期</th>
            <th>打卡时间</th>
            <th>图片</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.clockRecordMainDtos" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdUserName }}</td>
              <td>{{ item.fdClockAddress }}</td>
              <td>{{ formatDate(item.fdClockTime) }}</td>
              <td>{{ formatTime(item.fdClockTime) }}</td>
              <td><uploader mode="picture" multiple readonly :value="item.sysAttContractAspectParams || []" /></td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>
  </block>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    clockRecordMainDtos: [],
  },
});
export default {
  name: 'clock-list',
  mixins: [selectionMixin],
  methods: {
    formatDate(v) {
      if (!v) {
        return '';
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD');
    },
    formatTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(new Date(v)).format('HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
