<template>
  <span class="wrap-text">
    <template v-for="(text, index) in list">
      <span :key="index">
        {{ text }}
        <br v-if="index !== list.length - 1" />
      </span>
    </template>
  </span>
</template>

<script>
export default {
  name: "wrap-text",
  props: {
    content: String,
  },
  computed: {
    list() {
      return (this.content || "").split("\\r\\n");
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-text {
}
</style>
