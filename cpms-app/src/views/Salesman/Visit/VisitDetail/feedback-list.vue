<template>
  <block theme="primary" title="拜访反馈记录">
    <div class="table">
      <div class="table-main">
        <table v-if="tempValue.spersonVisitFeedbackList">
          <thead>
            <th>序号</th>
            <th>实际拜访人姓名</th>
            <th>实际拜访人电话</th>
            <th>实际拜访人职务</th>
            <th>反馈内容</th>
            <th>图片</th>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in !!tempValue.spersonVisitFeedbackList ? [tempValue.spersonVisitFeedbackList] : []"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdVisitName }}</td>
              <td>{{ item.fdVisitMobile }}</td>
              <td>{{ item.fdVisitJob }}</td>
              <td>{{ item.fdProjectFeedback }}</td>
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
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    spersonVisitFeedbackList: undefined,
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
