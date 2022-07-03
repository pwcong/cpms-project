<template>
  <div class="report-rank">
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card" style="height: 587px">
          <template slot="title">
            <div>客户排行榜</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>

          <template slot="action">
            <p-icon
              type="question-circle"
              name="question-o"
              style="color: #5592fa; font-size: 18px"
              @click="handelBulletin"
            />
            <div class="report-action">
              <p-icon
                type="arrow-down"
                @click="handleClientSort('desc')"
                v-if="clientSort === 'asc'"
                style="
                  transform: rotate(180deg);
                  color: #91cc75;
                  font-size: 18px;
                  margin-left: 10px;
                "
                name="down"
              />
              <p-icon
                type="arrow-down"
                @click="handleClientSort('asc')"
                v-if="clientSort === 'desc'"
                name="down"
                style="color: #e50113; font-size: 18px; margin-left: 10px"
              />
              <p-icon
                :class="{ active: customerToggle }"
                type="table"
                name="font-o"
                style="font-size: 18px; margin-left: 10px"
                @click="customerToggle = !customerToggle"
              />
            </div>
          </template>

          <div style="margin-top: 16px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'customer-new', title: '新增' },
                { key: 'customer-visit', title: '实际拜访' },
              ]"
            >
              <template v-if="!customerToggle">
                <customer-new
                  :sort="clientSort"
                  slot="customer-new"
                  :reportQuery="reportQuery"
                />
                <customer-visit
                  :sort="clientSort"
                  slot="customer-visit"
                  :reportQuery="reportQuery"
                />
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
      </p-col>
      <p-col :span="12">
        <block theme="card" style="height: 587px">
          <block>
            <template slot="title">
              <div>项目排行榜</div>
              <div style="font-size: 12px; color: #999999">
                {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
              </div>
            </template>
            <template slot="action">
              <div class="report-action">
                <p-icon
                  @click="handleProjectSort('desc')"
                  v-if="projectSort === 'asc'"
                  type="arrow-down"
                  style="
                    transform: rotate(180deg);
                    color: #91cc75;
                    font-size: 18px;
                    margin-left: 10px;
                  "
                />
                <p-icon
                  @click="handleProjectSort('asc')"
                  v-if="projectSort === 'desc'"
                  type="arrow-down"
                  style="color: #e50113; font-size: 18px; margin-left: 10px"
                />
                <p-icon
                  :class="{ active: projectToggle }"
                  @click="projectToggle = !projectToggle"
                  type="table"
                  name="font-o"
                  style="font-size: 18px; margin-left: 10px"
                />
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
                    <project-report-quantity-table
                      :sort="projectSort"
                      :reportQuery="reportQuery"
                    />
                  </div>
                  <div slot="project-visit">
                    <project-report-money-table
                      :sort="projectSort"
                      :reportQuery="reportQuery"
                    />
                  </div>
                </template>
              </tabs-layout>
            </div>
          </block>
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card" style="height: 587px">
          <block>
            <template slot="title">
              <div>线索排行榜</div>
              <div style="font-size: 12px; color: #999999">
                {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
              </div>
            </template>
            <template slot="action">
              <div class="report-action">
                <p-icon
                  @click="handleClueSort('desc')"
                  v-if="clueSort === 'asc'"
                  type="arrow-down"
                  style="
                    transform: rotate(180deg);
                    color: #91cc75;
                    font-size: 18px;
                    margin-left: 10px;
                  "
                />
                <p-icon
                  @click="handleClueSort('asc')"
                  v-if="clueSort === 'desc'"
                  type="arrow-down"
                  style="color: #e50113; font-size: 18px; margin-left: 10px"
                />
                <p-icon
                  :class="{ active: clueToggle }"
                  @click="clueToggle = !clueToggle"
                  type="table"
                  name="font-o"
                  style="font-size: 18px; margin-left: 10px"
                />
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
                  <clue-trun-project
                    slot="clue-trun-project"
                    :sort="clueSort"
                    :reportQuery="reportQuery"
                  />
                  <clue-valid-follow
                    slot="clue-valid-follow"
                    :sort="clueSort"
                    :reportQuery="reportQuery"
                  />
                </template>
                <template v-else>
                  <div slot="clue-trun-project">
                    <clue-turn-project-table
                      :sort="clueSort"
                      :reportQuery="reportQuery"
                    />
                  </div>
                  <div slot="clue-valid-follow">
                    <clue-valid-table :sort="clueSort" :reportQuery="reportQuery" />
                  </div>
                </template>
              </tabs-layout>
            </div>
          </block>
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card" style="height: 587px">
          <block>
            <template slot="title">
              <div>拜访排行榜</div>
              <div style="font-size: 12px; color: #999999">
                {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
              </div>
            </template>
            <template slot="action">
              <div class="report-action">
                <p-icon
                  @click="handleVisitSort('')"
                  v-if="visitSort === 'asc'"
                  type="arrow-down"
                  style="
                    transform: rotate(180deg);
                    color: #91cc75;
                    font-size: 18px;
                    margin-left: 10px;
                  "
                />
                <p-icon
                  @click="handleVisitSort('asc')"
                  v-if="visitSort === ''"
                  type="arrow-down"
                  style="color: #e50113; font-size: 18px; margin-left: 10px"
                />
                <p-icon
                  :class="{ active: visitToggle }"
                  @click="visitToggle = !visitToggle"
                  type="table"
                  name="font-o"
                  style="font-size: 18px; margin-left: 10px"
                />
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
                  <visit-project
                    slot="visit-project"
                    :sort="visitSort"
                    :reportQuery="reportQuery"
                  ></visit-project>
                  <visit-project-valid
                    slot="visit-project-valid"
                    :sort="visitSort"
                    :reportQuery="reportQuery"
                  ></visit-project-valid>
                </template>
                <template v-else>
                  <div slot="visit-project">
                    <salesman-new-table :sort="visitSort" :reportQuery="reportQuery" />
                  </div>
                  <div slot="visit-project-valid">
                    <visit-reality-table :sort="visitSort" :reportQuery="reportQuery" />
                  </div>
                </template>
              </tabs-layout>
            </div>
          </block>
        </block>
      </p-col>
    </p-row>
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
    ClueValidTable,
    SalesmanNewTable,
    VisitRealityTable,
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
      this.$message.info('待审批、审批中记录不参与排名统计 !');
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
    .p-icon {
      margin-left: 8px;
      color: #ccc;
    }
    .active {
      color: #e50113;
    }
    .p-icon-down {
      font-size: 16px;
    }
  }
}
</style>
