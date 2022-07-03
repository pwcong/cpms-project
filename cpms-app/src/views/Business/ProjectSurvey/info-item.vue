<template>
  <div class="project-follow">
    <div class="project-follow-wrapper" v-if="tempValue.length > 0">
      <div class="project-follow-col" v-for="(item, index) in tempValue" :key="index">
        <div class="project-follow-content">
          <div class="project-follow-title">
            <span>
              {{ item.fdProjectStageName }}
            </span>
          </div>
          <div class="project-follow-list">
            <div>
              <div>项目总数: {{ item.fdProjectTotal }}</div>
              <div>项目总金额(元): {{ formatAmount(item.fdProjectSum) || 0 }}</div>
            </div>
          </div>
        </div>
        <div class="project-follow-group">
          <div class="project-follow-item" :key="index" v-for="(project, index) in item.projectMainListDtos || []">
            <project-item :value="project" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import ProjectItem from './project-item';
const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  mixins: [selectionMixin, formatMixin],
  components: {
    ProjectItem,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.project-follow {
  width: 100%;
  height: calc(100vh - 195px);
  position: relative;
  &-wrapper {
    height: 100%;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0;
  }

  &-col {
    display: inline-block;
    width: 100%;
    border: 1px solid #dddddd;
    border-bottom: none;
    height: 100%;
    position: relative;

    &:not(:first-child) {
      margin-left: -1px;
    }

    &:first-child {
      border-left: none;
    }
    &:last-child {
      border-right: none;
    }
  }

  &-content,
  &-group {
    position: absolute;
    left: 0;
    width: 100%;
  }

  &-content {
    top: 0;
    height: 80px;
    border-bottom: 1px solid #dddddd;
  }

  &-group {
    overflow-y: auto;
    padding: 8px;
    top: 80px;
    height: calc(100% - 80px);
  }

  &-title {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: $theme-color;
  }

  &-list {
    padding: 8px;
    box-sizing: border-box;
    overflow-y: auto;
    font-size: 12px;
  }

  &-item {
    margin-bottom: 8px;
  }
}
</style>
