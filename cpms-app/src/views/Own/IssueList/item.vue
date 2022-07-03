<template>
  <div class="project-item" @click="handleDetail(tempValue)">
    <div class="left">
      <div class="desc">
        <span class="descone">问题描述: </span>
        <span class="descSpan">{{ tempValue.fdDesc || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">提问时间: </span>
        <span class="descSpan">{{ formatDateTime(tempValue.fdDate) || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">处理人姓名: </span>
        <span class="descSpan">{{ tempValue.fdHandleUserName || '--' }}</span>
      </div>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus"> {{ tempValue.fdStatusName }}</status-tag>
    </div>
    <setting-issue :moduleId="settingId" :mode="settingMode" :visible.sync="settingVisible" />
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SettingIssue from './setting-issue';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'issue-list-item',
  mixins: [selectionMixin, formatMixin],
  components: {
    SettingIssue,
  },
  data() {
    return {
      settingVisible: false,
      settingMode: 'add',
      settingId: '',
    };
  },
  methods: {
    handleDetail(record) {
      this.settingMode = 'view';
      this.settingId = record.id;
      this.settingVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .left {
    .title {
      font-size: 14px;
      padding-right: 70px;
      color: #333333;
    }

    .desc {
      margin-top: 6px;
    }
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
