<template>
  <div
    :class="['status-seal', `status-seal--${status}`]"
    v-show="status !== undefined && status !== ''"
  >
    <div class="status-seal-wrapper">
      <div class="status-seal-bg">
        <svg-icon type="seal" />
      </div>

      <div class="status-seal-text">
        <div class="status-seal-text-wrapper">
          <slot name="default" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'status-seal',
  props: {
    status: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.status-seal {
  display: inline-block;
  position: relative;
  font-size: 0;
  user-select: none;
  height: 46px;
  width: 108px;

  &-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 86px;
    height: 86px;
  }

  &-bg {
    .svg-icon {
      width: 86px;
      height: 86px;
      margin: 0;
    }
  }

  &-text {
    font-size: 12px;
    position: absolute;
    top: 50%;
    font-weight: bold;
    left: 50%;
    white-space: nowrap;
    transform: translate(-50%, -50%) rotate(15deg);
  }

  &--todo,
  &--ready {
    color: rgb(243, 111, 57);
  }

  &--changing {
    color: rgb(124, 94, 216);
  }

  &--handle,
  &--follow,
  &--part,
  &--audit {
    color: rgb(2, 177, 255);
  }

  &--changed,
  &--pushing {
    color: rgb(232, 91, 190);
  }

  &--solved,
  &--pass,
  &--success,
  &--1,
  &--complete,
  &--done {
    color: rgb(25, 189, 143);
  }

  &--lost,
  &--discard,
  &--error,
  &--fail,
  &--reject {
    color: rgb(234, 47, 47);
  }

  &--0,
  &--close,
  &--draft {
    color: rgb(91, 91, 91);
  }
}
</style>
