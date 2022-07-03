<template>
  <div class="report-rank">
    <block theme="card">
      <block>
        <template slot="title">
          <div>{{ date.text }}客户排行榜</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>

        <template slot="action">
          <van-icon name="question-o" size="20" color="#5592fa" @click="handelBulletin" />
          <div class="report-action">
            <van-icon
              @click="handleClientSort('desc')"
              v-if="clientSort === 'asc'"
              style="transform: rotate(180deg)"
              name="down"
              color="#91cc75"
            />
            <van-icon @click="handleClientSort('asc')" v-if="clientSort === 'desc'" name="down" color="#e50113" />

            <van-icon :class="{ active: customerToggle }" name="font-o" @click="customerToggle = !customerToggle" />
          </div>
        </template>

        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'customer-new', title: '新增数量' },
              { key: 'customer-visit', title: '实际拜访数' },
            ]"
          >
            <template v-if="!customerToggle">
              <customer-new :sort="clientSort" slot="customer-new" :reportQuery="reportQuery" />
              <customer-visit :sort="clientSort" slot="customer-visit" :reportQuery="reportQuery" />
            </template>
            <template v-else>
              <div slot="customer-new">
                <customer-new-table :sort="clientSort" :reportQuery="reportQuery" />
              </div>
              <div slot="customer-visit">
                <customer-visit-table :sort="clientSort" :reportQuery="reportQuery" />
              </div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}项目排行榜</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              @click="handleProjectSort('desc')"
              v-if="projectSort === 'asc'"
              style="transform: rotate(180deg)"
              name="down"
              color="#91cc75"
            />
            <van-icon @click="handleProjectSort('asc')" v-if="projectSort === 'desc'" name="down" color="#e50113" />
            <van-icon :class="{ active: projectToggle }" name="font-o" @click="projectToggle = !projectToggle" />
          </div>
        </template>

        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'project-report', title: '报备数量' },
              { key: 'project-visit', title: '报备金额' },
            ]"
          >
            <template v-if="!projectToggle">
              <project-report-quantity
                projectSort
                :sort="projectSort"
                slot="project-report"
                :reportQuery="reportQuery"
              ></project-report-quantity>
              <project-report-money
                :sort="projectSort"
                projectSort
                slot="project-visit"
                :reportQuery="reportQuery"
              ></project-report-money>
            </template>
            <template v-else>
              <div slot="project-report">
                <project-report-quantity-table :sort="projectSort" :reportQuery="reportQuery" />
              </div>
              <div slot="project-visit">
                <project-report-money-table :sort="projectSort" :reportQuery="reportQuery" />
              </div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}线索排行榜</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              @click="handleClueSort('desc')"
              v-if="clueSort === 'asc'"
              style="transform: rotate(180deg)"
              name="down"
              color="#91cc75"
            />
            <van-icon @click="handleClueSort('asc')" v-if="clueSort === 'desc'" name="down" color="#e50113" />
            <van-icon :class="{ active: clueToggle }" name="font-o" @click="clueToggle = !clueToggle" />
          </div>
        </template>
        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'clue-trun-project', title: '已转项目报备' },
              { key: 'clue-valid-follow', title: '线索有效跟进数量' },
            ]"
          >
            <template v-if="!clueToggle">
              <clue-trun-project slot="clue-trun-project" :sort="clueSort" :reportQuery="reportQuery" />
              <clue-valid-follow slot="clue-valid-follow" :sort="clueSort" :reportQuery="reportQuery" />
            </template>
            <template v-else>
              <div slot="clue-trun-project">
                <clue-turn-project-table :sort="clueSort" :reportQuery="reportQuery" />
              </div>
              <div slot="clue-valid-follow"><clue-valid-table :sort="clueSort" :reportQuery="reportQuery" /></div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}拜访排行榜</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              @click="handleVisitSort('')"
              v-if="visitSort === 'asc'"
              style="transform: rotate(180deg)"
              name="down"
              color="#91cc75"
            />
            <van-icon @click="handleVisitSort('asc')" v-if="visitSort === ''" name="down" color="#e50113" />
            <van-icon :class="{ active: visitToggle }" name="font-o" @click="visitToggle = !visitToggle" />
          </div>
        </template>
        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'visit-project', title: '拜访计划' },
              { key: 'visit-project-valid', title: '有效拜访率' },
            ]"
          >
            <template v-if="!visitToggle">
              <visit-project slot="visit-project" :sort="visitSort" :reportQuery="reportQuery"></visit-project>
              <visit-project-valid
                slot="visit-project-valid"
                :sort="visitSort"
                :reportQuery="reportQuery"
              ></visit-project-valid>
            </template>
            <template v-else>
              <div slot="visit-project"><salesman-new-table :sort="visitSort" :reportQuery="reportQuery" /></div>
              <div slot="visit-project-valid"><visit-reality-table :sort="visitSort" :reportQuery="reportQuery" /></div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
  </div>
</template>

<script>
import reportMixin from '../mixins/report';
import CustomerNew from '../components/report/customer-new';
import CustomerVisit from '../components/report/customer-visit';
import ProjectReportQuantity from '../components/report/project-report-quantity';
import ProjectReportMoney from '../components/report/project-report-money';
import ClueTrunProject from '../components/report/clue-trun-project';
import ClueValidFollow from '../components/report/clue-valid-follow';
import VisitProject from '../components/report/visit-project';
import VisitProjectValid from '../components/report/visit-project-valid';
import CustomerNewTable from '../components/report/customer-new-table';
import CustomerVisitTable from '../components/report/customer-visit-table';
import ProjectReportMoneyTable from '../components/report/project-report-money-table';
import ProjectReportQuantityTable from '../components/report/project-report-quantity-table';
import ClueTurnProjectTable from '../components/report/clue-turn-project-table';
import ClueValidTable from '../components/report/clue-valid-table';
import SalesmanNewTable from '../components/report/salesman-new-table';
import VisitRealityTable from '../components/report/visit-reality-table';

export default {
  mixins: [reportMixin],
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CustomerNew,
    CustomerVisit,
    ProjectReportQuantity,
    ProjectReportMoney,
    ClueTrunProject,
    ClueValidFollow,
    VisitProject,
    VisitProjectValid,
    CustomerNewTable,
    CustomerVisitTable,
    ProjectReportMoneyTable,
    ProjectReportQuantityTable,
    ClueTurnProjectTable,
    SalesmanNewTable,
    VisitRealityTable,
    ClueValidTable,
  },
  data() {
    return {
      customerToggle: false,
      projectToggle: false,
      clueToggle: false,
      visitToggle: false,
      clientSort: 'desc',
      projectSort: 'desc',
      clueSort: 'desc',
      visitSort: '',
    };
  },
  methods: {
    handleClientSort(value) {
      this.clientSort = value;
    },
    handleProjectSort(value) {
      this.projectSort = value;
    },
    handleClueSort(value) {
      this.clueSort = value;
    },
    handleVisitSort(value) {
      this.visitSort = value;
    },
    handelBulletin() {
      this.$toast('待审批、审批中记录不参与排名统计 !');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.report-rank {
  padding: 8px;
  .report-action {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #666666;
    .van-icon {
      margin-left: 8px;

      &.active {
        color: $theme-color;
      }
    }
    .van-icon-down {
      font-size: 16px;
    }
  }
}
</style>
