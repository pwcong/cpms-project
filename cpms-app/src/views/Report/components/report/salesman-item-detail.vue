<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout class="salesman-detail">
      <template v-slot:header="{ className }">
        <van-nav-bar :class="className" title="业务员详情" left-text="取消" left-arrow @click-left="onCancel" />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <div class="user">
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <table v-show="!loading">
              <tr>
                <td>
                  姓名: <span>{{ particulars.name }}</span>
                </td>
                <td>
                  账号: <span>{{ particulars.loginName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  部门: <span>{{ particulars.loginDeptName }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  手机: <span>{{ particulars.mobile || '-' }}</span>
                  <van-icon
                    v-show="particulars.mobile"
                    @click="call(particulars.mobile)"
                    class="phone"
                    name="phone-o"
                    color="#ee0a24"
                  />
                </td>
              </tr>
            </table>
          </div>

          <block theme="primary" title="近半年新增记录统计">
            <div class="time">{{ nearlyHalfYear }}</div>
            <salesman-six-months-new :loginName="loginNameList" :reportQuery="reportQuery"></salesman-six-months-new>
          </block>

          <block theme="primary" title="客户信息">
            <div class="time">{{ formatDateRange(date.value) }}</div>
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <data-grid
              v-show="!loading"
              theme="report"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
              :value="[
                {
                  key: 'a',
                  title: '意向客户新增',
                  value: custCountDto.custNewCreateCount + ' 个',
                },
                {
                  key: 'b',
                  title: '正式客户新增',
                  value: custCountDto.fdSapNewCreateCount + ' 个',
                },
                {
                  key: 'c',
                  title: '意向客户总数',
                  value: custCountDto.fdCreateTotal + ' 个',
                },
              ]"
            >
              <template v-slot:title="{ item }">
                <span v-if="item.key === 'c'">
                  <span style="color: #50c5ef">
                    {{ item.title }}
                  </span>
                </span>
              </template>
              <template v-slot:c="{ item }">
                <span
                  :style="{
                    color: '#50c5ef',
                  }"
                >
                  {{ item.value }}
                </span>
              </template>
            </data-grid>
          </block>
          <block theme="primary" title="项目信息">
            <div class="time">{{ formatDateRange(date.value) }}</div>
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <data-grid
              v-show="!loading"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
              theme="report"
              :value="[
                {
                  key: 'a',
                  title: '项目新增数量',
                  value: projectReportDTO.fdNewProjectCount + ' 个',
                },
                {
                  key: 'b',
                  title: '项目新增金额',
                  value: formatAmount(projectReportDTO.fdNewProjectSum),
                },
                {
                  key: 'c',
                  title: '项目总数',
                  value: projectReportDTO.fdProjectTotal + ' 个',
                },
              ]"
            >
              <template v-slot:title="{ item }">
                <span v-if="item.key === 'c'">
                  <span style="color: #50c5ef">
                    {{ item.title }}
                  </span>
                </span>
              </template>
              <template v-slot:c="{ item }">
                <span
                  :style="{
                    color: '#50c5ef',
                  }"
                >
                  {{ item.value }}
                </span>
              </template>
            </data-grid>
            <data-grid
              v-show="!loading"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
              theme="report"
              :value="[
                {
                  key: 'a',
                  title: '价格新增',
                  value: projectReportDTO.priceCount + ' 个',
                },
                {
                  key: 'b',
                  title: '授权新增',
                  value: projectReportDTO.grantCount + ' 个',
                },
                {
                  key: 'c',
                  title: '合同新增',
                  value: projectReportDTO.contraCount + ' 个',
                },
              ]"
            >
            </data-grid>
          </block>
          <block theme="primary" title="拜访信息">
            <div class="time">{{ formatDateRange(date.value) }}</div>
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <data-grid
              v-show="!loading"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color:#00b050; font-size: 12px' })"
              theme="report"
              :value="[
                {
                  key: 'a',
                  title: '拜访计划新增',
                  value: visitFeedbackDTO.planVisitCount + ' 个',
                },
                {
                  key: 'b',
                  title: '有效拜访',
                  value: visitFeedbackDTO.validVisitCount + ' 个',
                },
                {
                  key: 'c',
                  title: '有效拜访率',
                  value: visitFeedbackDTO.validVisitPercentage + '%',
                },
              ]"
            >
              <template v-slot:title="{ item }">
                <span v-if="item.key === 'c'">
                  <span style="color: #fac857">
                    {{ item.title }}
                  </span>
                </span>
              </template>
              <template v-slot:c="{ item }">
                <span
                  :style="{
                    color: ' #fac857',
                  }"
                >
                  {{ item.value }}
                </span>
              </template>
            </data-grid>
          </block>
          <block theme="primary" title="线索信息">
            <!-- <div class="time">{{ formatDateRange(date.value) }}</div> -->
            <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
            <data-grid
              v-show="!loading"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
              theme="report"
              :value="[
                {
                  key: 'a',
                  title: '累计认领',
                  value: clueCountDto.claimTotal + ' 个',
                },
                {
                  key: 'b',
                  title: '已转项目数',
                  value: clueCountDto.changedCount + ' 个',
                },
                {
                  key: 'c',
                  title: '有效跟进数',
                  value: clueCountDto.validFollowCount + ' 个',
                },
              ]"
            >
            </data-grid>
            <data-grid
              v-show="!loading"
              :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #666666; font-size: 12px' })"
              theme="report"
              :value="[
                {
                  key: 'a',
                  title: '已转化率',
                  value: clueCountDto.conversionRate + '%',
                },
                {
                  key: 'b',
                  title: '有效跟进率',
                  value: clueCountDto.validFollowRate + '%',
                },
              ]"
            >
              <template v-slot:title="{ item }">
                <span v-if="item.key === 'a'">
                  <span style="color: #fac857">
                    {{ item.title }}
                  </span>
                </span>
                <span v-if="item.key === 'b'">
                  <span style="color: #fac857">
                    {{ item.title }}
                  </span>
                </span>
              </template>
              <template v-slot:a="{ item }">
                <span
                  :style="{
                    color: ' #fac857',
                  }"
                >
                  {{ item.value }}
                </span>
              </template>
              <template v-slot:b="{ item }">
                <span
                  :style="{
                    color: ' #fac857',
                  }"
                >
                  {{ item.value }}
                </span>
              </template>
            </data-grid>
          </block>
          <block theme="primary" title="本月拜访打卡城市排名">
            <div class="time">{{ formatDateRange(date.value) }}</div>
            <div>
              <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
              <div v-show="!loading">
                <v-chart class="chart" :option="option" />
              </div>
            </div>
          </block>
          <block theme="primary" title="业务员客户行业分布">
            <!-- <div class="time">{{ formatDateRange(date.value) }}</div> -->
            <salesman-client-industry
              :loginNameList="loginNameList"
              :reportQuery="reportQuery"
            ></salesman-client-industry>
          </block>
          <block theme="primary" title="业务员项目行业分布">
            <!-- <div class="time">{{ formatDateRange(date.value) }}</div> -->
            <salesman-project-industry
              :loginNameList="loginNameList"
              :reportQuery="reportQuery"
            ></salesman-project-industry>
          </block>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';
import { buildSelectionMixin, buildListMixin, formatMixin } from '@/mixins';
import reportMixin from '../../mixins/report';
import SalesmanSixMonthsNew from '../report/salesman-six-months-new';
import SalesmanClientIndustry from '../report/salesman-client-industry';
import SalesmanProjectIndustry from '../report/salesman-project-industry';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

const reqMixin = buildListMixin({
  relation: ['loginNameList', 'reportQuery', 'visible'],
  getData: async (_) => {
    const { loginNameList, reportQuery, visible } = _;

    if (!loginNameList || !visible) {
      return {};
    }

    const value = await api.report.getSalesmanDetail({
      ...reportQuery,
      loginNameList,
    });
    _.particulars = {
      name: value.userName,
      loginName: value.loginName,
      loginDeptName: value.loginDeptName,
      mobile: value.mobile,
    };
    _.custCountDto = {
      fdCreateTotal: value.custCountDto.fdCreateTotal || '0', //意向客户总数
      fdSapNewCreateCount: value.custCountDto.fdSapNewCreateCount || '0', //正式客户新增
      custNewCreateCount: value.custCountDto.fdNewCreateCount || '0', //意向客户新增
    };
    _.projectReportDTO = {
      fdNewProjectCount: value.projectReportDTO.fdNewProjectCount || '0', //项目新增数量
      fdNewProjectSum: value.projectReportDTO.fdNewProjectSum || '0', //新增项目总金额
      fdProjectTotal: value.projectReportDTO.fdProjectTotal || '0', //项目总数
      priceCount: value.projectReportDTO.priceCount || '0', //价格新增
      grantCount: value.projectReportDTO.grantCount || '0', //授权新增
      contraCount: value.projectReportDTO.contraCount || '0', //合同新增
    };
    _.visitFeedbackDTO = {
      planVisitCount: value.visitFeedbackDTO.planVisitCount || '0', //拜访计划新增
      validVisitCount: value.visitFeedbackDTO.validVisitCount || '0', //有效拜访
      validVisitPercentage: value.visitFeedbackDTO.validVisitPercentage || '0', //有效拜访率
    };
    _.clueCountDto = {
      claimTotal: value.clueCountDto.claimTotal || '0', //累计认领
      changedCount: value.clueCountDto.changedCount || '0', //已转项目数
      validFollowCount: value.clueCountDto.validFollowCount || '0', //有效跟进数
      validFollowRate: value.clueCountDto.validFollowRate || '0', //有效跟进率
      conversionRate: value.clueCountDto.conversionRate || '0', //已转化率
    };
    let cityName = (value.reportStatisticsDTOS || []).map((d) => {
      return d.name;
    });
    let cityData = (value.reportStatisticsDTOS || []).map((d) => {
      return d.total;
    });
    if (value.reportStatisticsDTOS.length == 0) {
      cityName = ['暂无数据'];
      cityData = [0];
    } else {
    }

    _.option = {
      yAxis: { data: cityName },
      series: [
        {
          data: cityData,
        },
      ],
    };
    return {};
  },
});

export default {
  name: 'salesman-item-detail',
  mixins: [selectionMixin, reqMixin, reportMixin, formatMixin],
  data() {
    return {
      report: {},
      nearlyHalfYear:
        dayjs().subtract(5, 'M').startOf('M').startOf('d').format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs().endOf('M').endOf('d').format('YYYY-MM-DD'),
      particulars: {
        name: '-',
        loginName: '-',
        loginDeptName: '-',
        mobile: '-',
      },
      custCountDto: {
        fdCreateTotal: '0', //意向客户总数
        fdSapNewCreateCount: '0', //正式客户新增
        custNewCreateCount: '0', //意向客户新增
      }, //客户
      clueCountDto: {
        claimTotal: '0', //累计认领
        changedCount: '0', //已转项目数
        validFollowCount: '0', //有效跟进数
        validFollowRate: '0', //有效跟进率
        conversionRate: '0', //已转化率
      }, //线索
      projectReportDTO: {
        fdNewProjectCount: '0', //项目新增数量
        fdNewProjectSum: '0', //新增项目总金额
        fdProjectTotal: '0', //项目总数
        priceCount: '0', //价格新增
        grantCount: '0', //授权新增
        contraCount: '0', //合同新增
      }, //项目
      visitFeedbackDTO: {
        planVisitCount: '0', //拜访计划新增
        validVisitCount: '0', //有效拜访
        validVisitPercentage: '0', //有效拜访率
      }, //拜访
      option: {
        title: {
          text: '',
          subtext: '',
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '15%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            name: '已打卡',
            type: 'bar',
            barCategoryGap: '50%',
            label: {
              normal: {
                show: true, //是否显示
                position: 'right', //文字位置
                // formatter: '{c}', //c后面加单位
                // formatter: function (p) {
                //   return `${ctx.clue[p.dataIndex].fdNumber};${ctx.clue[p.dataIndex].fdPercentage}`;
                // },
              },
            },
          },
        ],
      },
    };
  },
  components: {
    SalesmanSixMonthsNew,
    SalesmanClientIndustry,
    SalesmanProjectIndustry,
  },
  props: {
    loginNameList: {
      type: String,
    },
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    call(value) {
      this.$nativeApi.financeCall(value);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.salesman-detail {
  .user {
    padding: 8px;
    table {
      width: 100%;
      font-size: 14px;
      color: #666666;

      td {
        padding: 4px 4px;
      }

      span {
        color: #333333;
      }
      .phone {
        font-size: 22px;
        margin-left: 8px;
        // transform: rotate(180deg)
      }
    }
  }
  .time {
    // background-color: rgba($theme-color, 0.1);
    border-bottom: 1px dashed #dddddd;
    padding: 4px;
    text-align: center;
    font-size: 12px;
    color: #333333;
  }

  .chart {
    height: 300px;
  }
}
</style>
