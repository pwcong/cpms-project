<template>
  <list-layout class="page-test">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="测试" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <calendar v-model="date">
          <template v-slot:date="{ value }">
            <div class="date">
              <div class="date-wrapper">
                {{ value.date() }}
              </div>
            </div>
          </template>
        </calendar>
      </div>
    </template>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'AdminTest',
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
  },
  data() {
    return {
      date: dayjs(new Date(2020, 0, 1)),
    };
  },
};
</script>

<style lang="scss" scoped>
.page-test {
  .date {
    padding: 2px;
    &-wrapper {
      font-size: 12px;
      margin: 0 auto;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: bisque;
    }
  }
}
</style>
