<template>
  <span class="dynamic-text">
    <span v-if="!!text">{{ text }}</span>
    <span class="placeholder" v-else-if="!!placeholder">
      {{ placeholder }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    placeholder: {
      type: String,
    },
  },
  name: 'dynamic-text',
};
</script>

<style lang="scss" scoped>
.dynamic-text {
  .placeholder {
    color: #cccccc;
  }
}
</style>
