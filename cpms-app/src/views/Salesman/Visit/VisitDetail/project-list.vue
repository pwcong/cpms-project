<template>
  <block theme="primary" title="更新项目状态">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.visitFeedbackListDtos.length > 0">
          <thead>
            <th>序号</th>
            <th>项目名称</th>
            <th>反馈内容</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in tempValue.visitFeedbackListDtos" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdProjectName }}</td>
              <td>{{ item.fdProjectFeedback }}</td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
    </div>
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    visitFeedbackListDtos: [],
  },
});
export default {
  name: 'project-list',
  mixins: [selectionMixin],
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
