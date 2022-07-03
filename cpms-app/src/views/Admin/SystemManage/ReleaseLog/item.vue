<template>
  <div class="project-item">
    <div class="left">
      <div class="desc">
        <span class="descone">发版内容: </span>
        <span class="descSpan">{{ tempValue.fdDesc || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">发版日期: </span>
        <span class="descSpan">{{ formatDateTime(tempValue.fdDate) || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">发版人: </span>
        <span class="descSpan">{{ tempValue.fdUserName || '--' }}</span>
      </div>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus"> {{ tempValue.fdStatusName }}</status-tag>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'issue-list-item',
  mixins: [selectionMixin, formatMixin],
  components: {},
  data() {
    return {};
  },
  methods: {},
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
      margin-right: 90px;
    }
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
