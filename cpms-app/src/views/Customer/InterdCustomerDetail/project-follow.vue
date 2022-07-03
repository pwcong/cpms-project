<template>
  <div class="follow-info">
    <div class="follow-info-wrapper">
      <div class="follow-list">
        <div
          :class="{
            'follow-item': true,
            active: index === selectedStep,
            done: index <= currentStep,
            start: index === 0,
            end: index === steps.length - 1,
          }"
          v-for="(item, index) in steps"
          :key="index"
          @click="!readonly && (selectedStep = index)"
        >
          <div class="follow-date">
            {{ item.date }}
          </div>
          <div class="follow-text">
            {{ item.text }}
          </div>
        </div>
      </div>
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
  name: 'follow-info',
  mixins: [selectionMixin],
  data() {
    return {
      steps: [
        {
          date: '19/05/07',
          text: '项目立项',
        },
        {
          date: '19/05/25',
          text: '方案设计',
        },
        {
          date: '19/05/07',
          text: '招投标',
        },
        {
          date: '19/07/07',
          text: '合同签订',
        },
        {
          date: '19/08/07',
          text: '合同交付',
        },
        {
          date: '19/10/07',
          text: '项目验收',
        },
        {
          date: '19/11/07',
          text: '项目回款',
        },
        {
          date: '*',
          text: '售后服务',
        },
      ],
      currentStep: 6,
      selectedStep: 7,
      formData: {},
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.follow-info {
  background-color: white;
  padding: 10px 20px;

  &-wrapper {
    overflow-x: auto;
  }
  .follow-list {
    font-size: 0;
    white-space: nowrap;
  }

  .follow-item {
    display: inline-block;
    width: 25%;
    height: 60px;
    font-size: 12px;
    position: relative;
    .follow-date,
    .follow-text {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    .follow-date {
      top: 2px;
    }
    .follow-text {
      bottom: 2px;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
    }
    &::before {
      width: 100%;
      height: 1px;
      background-color: $theme-color;
      transform: translateY(-50%);
      left: 0;
    }
    &::after {
      left: 50%;
      width: 14px;
      height: 14px;
      transform: translate(-50%, -50%);
      background-color: white;
      border-radius: 50%;
      border: 1px solid $theme-color;
    }

    &.start::before {
      left: 50%;
      width: 50%;
    }

    &.end::before {
      width: 50%;
    }

    &.done::after {
      background-color: $theme-color;
    }

    &.active {
      .follow-date,
      .follow-text {
        color: $theme-color;
      }
    }
  }
}
</style>
