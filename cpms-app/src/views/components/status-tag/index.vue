<template>
  <span :class="['status-tag', `status-tag--${status}`]">
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
  border-radius: 2px;
  font-size: 12px;
  max-width: 80px;
  text-align: center;

  color: rgb(153, 153, 153);
  background-color: rgb(255, 255, 255);
  border: 1px solid #eeeeee;

  &--todo {
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
  &--audit {
    color: rgb(2, 177, 255);
    background-color: rgb(214, 242, 255);
    border-color: rgb(214, 242, 255);
  }

  &--changed {
    color: rgb(232, 91, 190);
    background-color: rgb(251, 228, 244);
    border-color: rgb(251, 228, 244);
  }

  &--solved,
  &--pass,
  &--success,
  &--1,
  &--done {
    color: rgb(25, 189, 143);
    background-color: rgb(218, 244, 236);
    border-color: rgb(218, 244, 236);
  }

  &--lost,
  &--discard,
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
