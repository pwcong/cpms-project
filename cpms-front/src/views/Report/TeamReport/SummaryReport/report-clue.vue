<template>
  <div>
    <p-row :gutter="[8, 8]">
      <p-col :span="8">
        <block theme="card" title="线索新增趋势">
          <clue-conversion :reportQuery="reportQuery" />
        </block>
      </p-col>
      <p-col :span="8">
        <block theme="card" title="线索跟进状态">
          <clue-follow :reportQuery="reportQuery" />
        </block>
      </p-col>
      <p-col :span="8">
        <block theme="card" title="线索转化率">
          <clue-tendency :reportQuery="reportQuery" />
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="24">
        <block theme="card" title="线索分布">
          <clue-distri :reportQuery="reportQuery" />
        </block>
      </p-col>
    </p-row>
  </div>
</template>

<script>
import reportMixin from '../../mixins/report';
import ClueConversion from '@/views/Report/components/report/clue-conversion';
import ClueFollow from '@/views/Report/components/report/clue-follow';
import ClueTendency from '@/views/Report/components/report/clue-tendency';
import ClueDistri from '@/views/Report/components/report/clue-distri';

export default {
  mixins: [reportMixin],
  components: {
    ClueConversion,
    ClueFollow,
    ClueTendency,
    ClueDistri,
  },
};
</script>
