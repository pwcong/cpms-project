<template>
  <div class="report-rank">
    <p-row :gutter="[8, 8]">
      <p-col :span="24">
        <block theme="card">
          <block>
            <div
              style="
                font-size: 12px;
                color: #999999;
                text-align: center;
                padding-top: 5px;
              "
            >
              统计日期:
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <div v-show="!loading">
              <data-grid
                theme="report"
                style="margin-top: 4px"
                :value="[
                  {
                    key: 'projectNewCreate',
                    title: '项目新增',
                    value: report.projectNewCreate + '个' || '0',
                  },
                  {
                    key: 'projectMoney',
                    title: '项目新增金额',
                    value: report.projectMoney + '元' || '0',
                  },
                  {
                    key: 'projectSum',
                    title: '项目总数',
                    value: report.projectSum + '个' || '0',
                  },
                ]"
              >
              </data-grid>
              <data-grid
                theme="report"
                style="margin-top: 4px"
                :value="[
                  {
                    key: 'chainRatio',
                    title: '数量环比',
                    value: report.chainRatio + '%' || '0',
                    riseOrDecline: report.riseOrDecline,
                  },
                  {
                    key: 'moneyChainRatio',
                    title: '金额环比',
                    value: report.moneyChainRatio + '%' || '0',
                    moneyRiseOrDecline: report.moneyRiseOrDecline,
                  },
                ]"
              >
                <template v-slot:title="{ item }">
                  <span v-if="item.key === 'chainRatio'">
                    <span v-if="item.riseOrDecline === 'decline'" style="color: #e50113">
                      <p-icon
                        type="question-circle"
                        name="question-o"
                        style="color: #e50113; font-size: 18px"
                      />
                      {{ item.title }}
                    </span>
                    <span
                      v-else-if="item.riseOrDecline === 'rise'"
                      style="color: #07c160"
                    >
                      <p-icon
                        type="question-circle"
                        name="question-o"
                        style="color: #07c160; font-size: 18px; transform: rotate(180deg)"
                      />
                      {{ item.title }}
                    </span>
                    <span v-else>
                      {{ item.title }}
                    </span>
                  </span>
                  <span v-if="item.key === 'moneyChainRatio'">
                    <span
                      v-if="item.moneyRiseOrDecline === 'decline'"
                      style="color: #e50113"
                    >
                      <p-icon
                        type="question-circle"
                        name="question-o"
                        style="color: #e50113; font-size: 18px"
                      />
                      {{ item.title }}
                    </span>
                    <span
                      v-else-if="item.moneyRiseOrDecline === 'rise'"
                      style="color: #07c160"
                    >
                      <p-icon
                        type="question-circle"
                        name="question-o"
                        style="color: #07c160; font-size: 18px; transform: rotate(180deg)"
                      />
                      {{ item.title }}
                    </span>
                    <span v-else>
                      {{ item.title }}
                    </span>
                  </span>
                </template>
                <template v-slot:chainRatio="{ item }">
                  <span
                    :style="{
                      color:
                        item.riseOrDecline === 'decline'
                          ? '#e50113'
                          : item.riseOrDecline === 'rise'
                          ? '#07c160'
                          : undefined,
                    }"
                  >
                    {{ item.value }}
                  </span>
                </template>
                <template v-slot:moneyChainRatio="{ item }">
                  <span
                    :style="{
                      color:
                        item.moneyRiseOrDecline === 'decline'
                          ? '#e50113'
                          : item.moneyRiseOrDecline === 'rise'
                          ? '#07c160'
                          : undefined,
                    }"
                  >
                    {{ item.value }}
                  </span>
                </template>
              </data-grid>
            </div>
          </block>
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>项目行业分布</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <template slot="action">
            <div class="report-action">
              <p-icon
                :class="{ active: clientBusinessTab }"
                type="table"
                name="font-o"
                style="font-size: 18px; margin-left: 10px"
                @click="clientBusinessTab = !clientBusinessTab"
              />
            </div>
          </template>

          <div style="margin-top: 8px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'project-business-new', title: '新增' },
                { key: 'project-business-amount', title: '总计' },
              ]"
            >
              <template v-if="!clientBusinessTab">
                <project-business-new
                  slot="project-business-new"
                  :reportQuery="reportQuery"
                ></project-business-new>
                <project-business-amount
                  slot="project-business-amount"
                  :reportQuery="reportQuery"
                ></project-business-amount>
              </template>
              <template v-else>
                <div slot="project-business-new">
                  <project-business-new-table
                    :reportQuery="reportQuery"
                  ></project-business-new-table>
                </div>
                <div slot="project-business-amount">
                  <project-business-amount-table
                    :reportQuery="reportQuery"
                  ></project-business-amount-table>
                </div>
              </template>
            </tabs-layout>
          </div>
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>项目渠道分布</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <template slot="action">
            <div class="report-action">
              <p-icon
                :class="{ active: clientChannelTab }"
                type="table"
                name="font-o"
                style="font-size: 18px; margin-left: 10px"
                @click="clientChannelTab = !clientChannelTab"
              />
            </div>
          </template>

          <div style="margin-top: 8px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'project-channel-new', title: '新增' },
                { key: 'project-channel-amount', title: '总计' },
              ]"
            >
              <template v-if="!clientChannelTab">
                <project-channel-new
                  slot="project-channel-new"
                  :reportQuery="reportQuery"
                ></project-channel-new>
                <project-channel-amount
                  slot="project-channel-amount"
                  :reportQuery="reportQuery"
                ></project-channel-amount>
              </template>
              <template v-else>
                <div slot="project-channel-new">
                  <project-channel-new-table
                    :reportQuery="reportQuery"
                  ></project-channel-new-table>
                </div>
                <div slot="project-channel-amount">
                  <project-channel-amount-table
                    :reportQuery="reportQuery"
                  ></project-channel-amount-table>
                </div>
              </template>
            </tabs-layout>
          </div>
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>新增项目商务中心占比</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <template slot="action">
            <div class="report-action">
              <p-icon
                :class="{ active: clientProportionTab }"
                type="table"
                name="font-o"
                style="font-size: 18px; margin-left: 10px"
                @click="clientProportionTab = !clientProportionTab"
              />
            </div>
          </template>

          <div style="margin-top: 8px">
            <template v-if="!clientProportionTab">
              <new-project-business-center
                slot="new-project-business-center"
                :reportQuery="reportQuery"
              ></new-project-business-center>
            </template>
            <template v-else>
              <div slot="new-project-business-center">
                <new-project-business-center-table
                  :reportQuery="reportQuery"
                ></new-project-business-center-table>
              </div>
            </template>
          </div> </block
      ></p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>项目类型统计</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>

          <div style="margin-top: 8px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'project-type-new', title: '新增' },
                { key: 'project-type-amount', title: '总计' },
              ]"
            >
              <template>
                <project-type-new
                  slot="project-type-new"
                  :reportQuery="reportQuery"
                ></project-type-new>
                <project-type-amount
                  slot="project-type-amount"
                  :reportQuery="reportQuery"
                ></project-type-amount>
              </template>
            </tabs-layout>
          </div>
        </block>
      </p-col>
    </p-row>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>新增项目阶段统计</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>

          <div style="margin-top: 8px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'project-stage-bidding', title: '招标' },
                { key: 'project-stage-non-bidding', title: '非招标' },
                { key: 'project-stage-stock-up', title: '备货类' },
                { key: 'project-stage-amount', title: '全部' },
              ]"
            >
              <template>
                <project-stage-bidding
                  slot="project-stage-bidding"
                  :reportQuery="reportQuery"
                ></project-stage-bidding>
                <project-stage-non-bidding
                  slot="project-stage-non-bidding"
                  :reportQuery="reportQuery"
                ></project-stage-non-bidding>
                <project-stage-stock-up
                  slot="project-stage-stock-up"
                  :reportQuery="reportQuery"
                ></project-stage-stock-up>
                <project-stage-amount
                  slot="project-stage-amount"
                  :reportQuery="reportQuery"
                ></project-stage-amount>
              </template>
            </tabs-layout>
          </div> </block
      ></p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>新增报备产品型号统计</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>

          <div class="project-report-action">
            <p-button
              style="margin-right: 8px"
              plain
              type="dashed"
              :class="{ actives: !projectButton }"
              @click="handleProjectState('money')"
              size="mini"
              >按金额</p-button
            >
            <p-button
              plain
              type="dashed"
              :class="{ actives: projectButton }"
              @click="handleProjectState('number')"
              size="mini"
              >按数量</p-button
            >
          </div>

          <div style="margin-top: 8px">
            <tabs-layout
              theme="swiper"
              :tabs="[
                { key: 'product-model-tv', title: 'TV' },
                { key: 'product-model-health-appliances', title: '健康电器' },
                { key: 'product-model-air-conditioner', title: '空调' },
                { key: 'product-model-white-electricity', title: '白电' },
                { key: 'product-model-smart-home', title: '智能家居' },
              ]"
            >
              <template v-if="!clientProportionTab">
                <product-model-tv
                  slot="product-model-tv"
                  :projectState="projectState"
                  :reportQuery="reportQuery"
                ></product-model-tv>
                <product-model-health-appliances
                  slot="product-model-health-appliances"
                  :projectState="projectState"
                  :reportQuery="reportQuery"
                ></product-model-health-appliances>
                <product-model-air-conditioner
                  slot="product-model-air-conditioner"
                  :projectState="projectState"
                  :reportQuery="reportQuery"
                ></product-model-air-conditioner>
                <product-model-white-electricity
                  slot="product-model-white-electricity"
                  :projectState="projectState"
                  :reportQuery="reportQuery"
                ></product-model-white-electricity>
                <product-model-smart-home
                  slot="product-model-smart-home"
                  :projectState="projectState"
                  :reportQuery="reportQuery"
                ></product-model-smart-home>
              </template>
            </tabs-layout>
          </div>
        </block>
      </p-col>
    </p-row>
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../mixins/report';
import dataGrid from '@/components/data-grid';
import projectBusinessNew from '../components/report/project-business-new';
import projectBusinessAmount from '../components/report/project-business-amount';
import projectChannelNew from '../components/report/project-channel-new';
import projectChannelAmount from '../components/report/project-channel-amount';
import newProjectBusinessCenter from '../components/report/new-project-business-center';
import projectTypeNew from '../components/report/project-type-new';
import projectTypeAmount from '../components/report/project-type-amount';
import projectStageBidding from '../components/report/project-stage-bidding';
import projectStageNonBidding from '../components/report/project-stage-non-bidding';
import projectStageStockUp from '../components/report/project-stage-stock-up';
import projectStageAmount from '../components/report/project-stage-amount';
import productModelTv from '../components/report/product-model-tv';
import productModelAirConditioner from '../components/report/product-model-air-conditioner';
import productModelHealthAppliances from '../components/report/product-model-health-appliances';
import productModelSmartHome from '../components/report/product-model-smart-home';
import productModelWhiteElectricity from '../components/report/product-model-white-electricity';
import projectBusinessNewTable from '../components/report/project-business-new-table';
import projectBusinessAmountTable from '../components/report/project-business-amount-table';
import projectChannelNewTable from '../components/report/project-channel-new-table';
import projectChannelAmountTable from '../components/report/project-channel-amount-table';
import newProjectBusinessCenterTable from '../components/report/new-project-business-center-table';
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;
    const value = await api.report
      .getProjectMainReportProjectReport({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    _.report = {
      projectNewCreate: value.projectNewCreate, //项目新增
      projectMoney: value.projectMoney, //项目新增金额
      projectSum: value.projectSum, //项目总数
      chainRatio: value.numberChainRatio || '0', //数量环比
      riseOrDecline: value.numberRiseOrDecline, //数量环比上升或下降标识
      moneyChainRatio: value.moneyChainRatio || '0', //金额环比
      moneyRiseOrDecline: value.moneyRiseOrDecline, //金额环比上升或下降标识
    };
    return Promise.resolve({
      data: [],
    });
  },
});
export default {
  mixins: [reportMixin, reqMixin],
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    projectBusinessNew,
    projectBusinessAmount,
    projectChannelNew,
    projectChannelAmount,
    newProjectBusinessCenter,
    projectTypeNew,
    projectTypeAmount,
    projectStageBidding,
    projectStageNonBidding,
    projectStageStockUp,
    projectStageAmount,
    productModelTv,
    productModelAirConditioner,
    productModelHealthAppliances,
    productModelSmartHome,
    productModelWhiteElectricity,
    projectBusinessNewTable,
    projectBusinessAmountTable,
    projectChannelNewTable,
    projectChannelAmountTable,
    newProjectBusinessCenterTable,
    dataGrid,
  },
  data() {
    return {
      clientBusinessTab: false,
      clientChannelTab: false,
      clientProportionTab: false,
      projectButton: false,
      report: {
        projectNewCreate: '0', //项目新增
        projectMoney: '0', //项目新增金额
        projectSum: '0', //项目总数
        chainRatio: '0', //数量环比
        moneyChainRatio: '0', //金额环比
      },
      projectState: 'money',
    };
  },
  methods: {
    handleClientSort(value) {
      this.clientSort = value;
    },
    handleProjectState(value) {
      this.projectButton = !this.projectButton;
      this.projectState = value;
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
    }
    .active {
      color: #e50113;
    }
    .p-icon-down {
      font-size: 16px;
    }
  }
  .project-report-action {
    text-align: center;
    font-size: 20px;
    color: #666666;

    .actives {
      color: #e50113;
      border: 1px solid #e50113;
    }
  }
}
</style>
