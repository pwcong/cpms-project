<template>
  <block title="审批意见" theme="primary">
    <div class="table">
      <div class="table-main" style="margin: 10px">
        <table v-if="tempValue.u.length > 0" border="1">
          <thead>
            <th>审批时间</th>
            <th>审批人</th>
            <th>审批意见</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tempValue.u" :key="index">
              <td>{{ item.examineTime }}</td>
              <td>{{ item.examinePeople }}</td>
              <td>{{ item.examineOpinion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </block>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    u: [
      {
        examineTime: '2021-4-15 17:00:00',
        examinePeople: '斯蒂芬',
        examineOpinion: '同意',
      },
      {
        examineTime: '2021-4-15 17:00:00',
        examinePeople: '斯蒂芬',
        examineOpinion: '同意',
      },
      {
        examineTime: '2021-4-15 17:00:00',
        examinePeople: '斯蒂芬',
        examineOpinion: '同意',
      },
    ],
  },
});
export default {
  name: 'project-info',
  mixins: [selectionMixin],
  props: {
    readonly: {
      type: Boolean,
    },
  },
  data() {
    return {
      itemVisible: false,
      itemValue: {},
      itemIndex: -1,
      active: 2,
    };
  },
  methods: {
    // handleChangeItem(value) {
    //   this.tempValue.u = [...this.tempValue.u];
    //   // 如果下标大于等于0说明是编辑数据，否则是新增数据
    //   if (this.itemIndex > -1) {
    //     this.tempValue.u[this.itemIndex] = value;
    //   } else {
    //     this.tempValue.u.push(value);
    //   }
    //   this.tempValue.u = [...this.tempValue.u];
    //   this.onOk();
    // },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
