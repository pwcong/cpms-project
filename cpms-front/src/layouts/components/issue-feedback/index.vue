<template>
  <div class="issue-feedback">
    <div class="button" @click="visible = true">
      <p-icon class="button-icon" type="bulb" />
      <span class="button-label"> 问题反馈 </span>
    </div>

    <setting-issue :visible.sync="visible" mode="add" />
  </div>
</template>

<script>
import SettingIssue from './setting-issue';

export default {
  name: 'issue-feedback',
  components: {
    SettingIssue,
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
