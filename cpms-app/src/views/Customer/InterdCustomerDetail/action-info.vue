<template>
  <div class="action-info">
    <div class="action" v-for="(item, index) in actions" :key="index" @click="handleClick(item)">
      <div class="action-icon">
        <van-icon :name="item.icon" />
      </div>
      <div class="action-text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'action-info',
  mixins: [selectionMixin],
  data() {
    return {
      actions: [
        {
          icon: 'add-o',
          text: '项目创建',
          key: 'create',
        },
        {
          icon: 'exchange',
          text: '客户跟进',
        },
        {
          icon: 'phone-o',
          text: '沟通客户',
        },
        {
          icon: 'close',
          text: '置为无效',
        },
      ],
    };
  },
  methods: {
    handleClick(action) {
      switch (action.key) {
        case 'create':
          this.$router.push({
            path: '/Business/ProjectCreate',
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.action-info {
  background-color: white;
  display: flex;
  flex-flow: row wrap;
  user-select: none;
  .action {
    cursor: pointer;
    width: 25%;
    font-size: 12px;
    height: 70px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    &-icon {
      font-size: 16px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      background-color: $theme-color;
      color: white;
      border-radius: 50%;
    }

    &:active {
      background-color: rgba($theme-color, 0.1);
    }
  }
}
</style>
