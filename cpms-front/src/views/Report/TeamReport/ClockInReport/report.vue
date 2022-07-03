<template>
  <div>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card" title="计划拜访率">
          <visit-plan :reportQuery="reportQuery" />
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card" title="异常打卡">
          <clock-error :reportQuery="reportQuery" />
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="24">
        <block theme="card">
          <salesman-counter :reportQuery="reportQuery" />
        </block>
      </p-col>
    </p-row>
  </div>
</template>

<script>
import reportMixin from '../../mixins/report';
import ClockError from '@/views/Report/components/report/clock-error';
import VisitPlan from '@/views/Report/components/report/visit-plan';
import SalesmanCounter from '@/views/Report/components/report/salesman-counter';

export default {
  mixins: [reportMixin],
  components: {
    ClockError,
    VisitPlan,
    SalesmanCounter,
  },
};
</script>
