<template>
  <div class="faq">
    <div class="button" @click="visible = true">
      <p-icon class="button-icon" type="question-circle" />
      <span class="button-label"> 常见问题 </span>
    </div>

    <modal-issue :visible.sync="visible" />
  </div>
</template>

<script>
import ModalIssue from './modal-issue';

export default {
  name: 'faq',
  components: {
    ModalIssue,
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
  }

  &-icon {
    font-size: 14px;
  }
  &-label {
    margin-left: 5px;
  }
}
</style>
