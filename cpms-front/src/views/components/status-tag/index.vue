<template>
  <span
    :class="['status-tag', `status-tag--${status}`]"
    v-show="status !== undefined && status !== ''"
  >
    <slot name="default" />
  </span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
    },
  },
  name: 'status-tag',
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.status-tag {
  display: inline-block;
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 12px;
  border-radius: 2px;
  text-align: center;
  min-height: 24px;
  min-width: 24px;

  color: rgb(153, 153, 153);
  background-color: rgb(255, 255, 255);
  border: 1px solid #eeeeee;

  &--todo,
  &--ready {
    color: rgb(243, 111, 57);
    background-color: rgb(253, 231, 223);
    border-color: rgb(253, 231, 223);
  }

  &--changing {
    color: rgb(124, 94, 216);
    background-color: rgb(233, 229, 248);
    border-color: rgb(233, 229, 248);
  }

  &--handle,
  &--follow,
  &--part,
  &--audit {
    color: rgb(2, 177, 255);
    background-color: rgb(214, 242, 255);
    border-color: rgb(214, 242, 255);
  }

  &--changed,
  &--pushing {
    color: rgb(232, 91, 190);
    background-color: rgb(251, 228, 244);
    border-color: rgb(251, 228, 244);
  }

  &--solved,
  &--pass,
  &--success,
  &--1,
  &--complete,
  &--done {
    color: rgb(25, 189, 143);
    background-color: rgb(218, 244, 236);
    border-color: rgb(218, 244, 236);
  }

  &--lost,
  &--discard,
  &--error,
  &--fail,
  &--reject {
    color: rgb(234, 47, 47);
    background-color: rgb(251, 221, 221);
    border-color: rgb(251, 221, 221);
  }

  &--0,
  &--close,
  &--draft {
    color: rgb(91, 91, 91);
    background-color: rgb(219, 219, 219);
    border-color: rgb(219, 219, 219);
  }
}
</style>
