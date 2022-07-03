<template>
  <div class="project-follow">
    <div class="project-follow-wrapper" v-if="tempValue.length > 0">
      <div class="project-follow-col" v-for="(item, index) in tempValue" :key="index">
        <div class="project-follow-title">
          <!-- <span class="project-follow-sort">
            {{ item.fdSortSum }}
          </span> -->
          <span>
            {{ item.fdProjectStageName }}
          </span>
        </div>

        <div class="project-follow-desc">
          <project-sum :value="item" />
        </div>

        <div class="project-follow-list">
          <div
            :key="_index"
            class="project-follow-item"
            v-for="(project, _index) in item.projectMainListDtos || []"
          >
            <project-item :value="project" />
          </div>
        </div>
      </div>
    </div>
    <div style="padding: 36px 0" v-else>
      <p-empty />
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

import ProjectSum from './project-sum';
import ProjectItem from './project-item';

const selectionMixin = buildSelectionMixin({
  valueType: 'ARRAY',
  defaultValue: [],
});

export default {
  mixins: [selectionMixin],
  components: {
    ProjectSum,
    ProjectItem,
  },
};
</script>

<style lang="scss" scoped>
.project-follow {
  &-wrapper {
    display: flex;
  }

  &-col {
    flex: 1;
    border: 1px solid #dddddd;
    margin-left: -1px;
    // margin-right: -1px;
  }

  &-sort {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid #e50113;
    border-radius: 50%;
    box-sizing: border-box;
    margin-right: 8px;
    color: #e50113;
    font-size: 14px;
  }

  &-title {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: #e50113;
  }

  &-list {
    padding: 8px;
    box-sizing: border-box;
    height: calc(100vh - 450px);
    overflow-y: auto;
  }

  &-item {
    margin-bottom: 8px;
  }
}
</style>
