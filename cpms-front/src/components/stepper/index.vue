<template>
  <div class="stepper">
    <div class="stepper-wrapper">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="{
          step: true,
          active: currentStep === index,
          selected: selectedStep === index,
          done: step.done,
        }"
        @click="handleSelect(step, index)"
      >
        <div class="step-wrapper">
          <div class="step-dot" v-if="showDot">
            <p-icon v-if="step.done" type="check-circle" />
            <p-icon v-else-if="index === currentStep" type="clock-circle" />
          </div>
          <div class="step-text">
            <slot name="text" :step="step" :index="index">
              <span>
                {{ step.text }}
              </span>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'stepper',
  props: {
    steps: {
      type: Array,
      default: () => [],
    },
    showDot: {
      type: Boolean,
      default: true,
    },
    currentStep: {
      type: Array,
      default: -1,
    },
    selectedStep: {
      type: Array,
      default: -1,
    },
  },
  methods: {
    handleSelect(step, index) {
      this.$emit('select', step, index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.stepper {
  &-wrapper {
    font-size: 0;
    display: flex;
    flex-flow: row wrap;
  }

  .step {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    margin: 4px 0;
    margin-right: 12px;
    padding: 0 8px;
    transition: all 0.3s;
    background-color: #dddddd;
    color: #666666;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 0;
      border-top: 15px solid transparent;
      border-bottom: 15px solid transparent;
      border-left: 6px solid #dddddd;
      transition: all 0.3s;
    }

    &-wrapper {
      height: 30px;
      display: flex;
      align-items: center;
    }

    &-dot {
    }

    &-text {
      padding: 4px 6px;
    }

    &.done {
      .step-dot {
        color: $theme-color;
      }
      &::after {
        border-left-color: rgba($theme-color, 0.1);
      }
      background-color: rgba($theme-color, 0.1);
    }

    &.active {
      color: white;
      .step-dot {
        color: white;
      }
      background-color: rgba($theme-color, 0.5);
      &::after {
        border-left-color: rgba($theme-color, 0.5);
      }
    }
    &.selected {
      color: white;
      .step-dot {
        color: white;
      }
      background-color: rgba($theme-color, 0.9);
      &::after {
        border-left-color: rgba($theme-color, 0.9);
      }
    }
  }
}
</style>
