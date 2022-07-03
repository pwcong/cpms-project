<template>
  <div class="salesman-counter">
    <div>
      <div>{{ data.a || 0 }}</div>
      <div>本地打卡</div>
    </div>
    <div>
      <div>{{ data.b || 0 }}</div>
      <div>本地打卡异常</div>
    </div>
    <div>
      <div>{{ data.c || 0 }}</div>
      <div>外勤打卡</div>
    </div>
    <div>
      <div>{{ data.d || 0 }}</div>
      <div>外勤打卡异常</div>
    </div>
    <div>
      <div>{{ data.e || 0 }}</div>
      <div>拜访计划</div>
    </div>
  </div>
</template>

<script>
import reportMixin from '../../mixins/report';
import { buildListMixin } from '@/mixins';

const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: (_, query) => {
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  mixins: [reportMixin, reqMixin],
  data() {
    return {
      data: {},
    };
  },
};
</script>

<style lang="scss" scoped>
.salesman-counter {
  display: flex;
  padding: 16px 0;
  & > div {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #333333;
    position: relative;

    &:not(:last-child)::after {
      position: absolute;
      content: '';
      width: 1px;
      background-color: #dddddd;
      height: 32px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    & > div:nth-child(1) {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: bold;
      color: #e50113;
    }
  }
}
</style>
