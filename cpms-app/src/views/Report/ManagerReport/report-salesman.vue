<template>
  <div class="report-salesman" style="height: calc(100vh - 144px); background-color: white">
    <block style="padding: 12px; border-bottom: 1px solid #eeeeee; box-sizing: border-box">
      <template slot="title">
        <div style="font-size: 12px; color: #999999">统计日期: {{ formatDateRange(date.value) }}</div>
        <div style="font-size: 12px; color: #e50113; margin-top: 5px">注意：待审批、审批中记录不参与排名统计</div>
      </template>

      <template slot="action">
        <div class="report-action">
          <van-icon @click.stop="query.sortDir = 'asc'" v-if="query.sortDir === 'desc'" name="down" color="#e50113 " />
          <van-icon
            @click.stop="query.sortDir = 'desc'"
            v-if="query.sortDir === 'asc'"
            style="transform: rotate(180deg)"
            name="down"
            color="#91cc75"
          />
          <van-icon :class="{ active: switchTable }" name="font-o" @click="handleSwitchTable" />

          <van-icon :class="{ active: salesmanTab }" name="bar-chart-o" @click="handleEcharts" />
        </div>
      </template>
    </block>

    <template v-if="!salesmanTab">
      <van-pull-refresh
        v-if="!switchTable"
        :value="loading && !loadingMore"
        @refresh="onRefresh"
        style="position: relative; height: calc(100% - 65px); overflow: auto"
      >
        <van-list :value="loadingMore" :finished="!hasMore" finished-text="没有更多了" @load="onLoadMore">
          <div class="salesman" v-for="(item, index) in list" :key="index" @click="handleDetail(item)">
            <table>
              <tr style="vertical-align: bottom">
                <td>
                  <span style="color: #e50113; font-size: 18px; font-weight: bold; margin-right: 4px">
                    {{ index + 1 }}
                  </span>
                  <span style="color: #000000; font-size: 16px">
                    {{ item.userName || '-' }}
                  </span>
                </td>
                <td style="color: #6495ed; font-size: 14px">
                  {{
                    item.loginDeptName === 'B2B业务中心智能家居业务部'
                      ? '智能家居'
                      : item.loginDeptName === 'B2B业务中心运营商业务部'
                      ? '运营商业部'
                      : item.loginDeptName === 'B2B业务中心工程机业务部'
                      ? '工程机部'
                      : item.loginDeptName || '-'
                  }}
                </td>
                <td>
                  <span style="color: #6495ed"> {{ salesmanText }} </span>
                  <span style="color: #333333; font-size: 14px">
                    {{
                      salesmanText === '意向客户新增'
                        ? item.custNewCreateCount
                        : salesmanText === '线索转项目'
                        ? item.changedCount
                        : salesmanText === '项目新增'
                        ? item.projectNewCount
                        : salesmanText === '项目新增金额'
                        ? formatAmount(item.projectNewSum)
                        : salesmanText === '有效拜访'
                        ? item.validVisitCount
                        : salesmanText === '有效跟进线索'
                        ? item.validClueFollowCount
                        : '-'
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  线索跟进
                  <span>
                    {{ item.validClueFollowCount + ' 条' || '-' }}
                  </span>
                </td>
                <td>
                  意向客户新增
                  <span>
                    {{ item.custNewCreateCount + ' 个' || '-' }}
                  </span>
                </td>
                <td>
                  拜访计划
                  <span>
                    {{ item.planVisitCount + ' 个' || '-' }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  线索已转化
                  <span>
                    {{ item.changedCount + ' 条' || '-' }}
                  </span>
                </td>
                <td>
                  项目新增
                  <span>
                    {{ item.projectNewCount || '0' }}
                  </span>
                </td>
                <td>
                  有效拜访
                  <span>
                    {{ item.validVisitCount + ' 个' || '-' }}
                  </span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  项目新增金额
                  <span> {{ formatAmount(item.projectNewSum) || '-' }}</span>
                </td>
              </tr>
            </table>
          </div>
        </van-list>
      </van-pull-refresh>
      <template v-else>
        <ve-table
          class="salesman-table"
          :columns="
            [
              {
                title: '序号',
                field: 'index',
              },
              {
                title: '姓名',
                field: 'userName',
              },
              {
                title: '部门',
                field: 'loginDeptName',
              },
              {
                title: salesmanText,
                field: salesmanValeu,
              },
              {
                title: '线索认领总数',
                field: 'clueClaimTotal',
              },
              {
                title: '线索有效跟进',
                field: 'validClueFollowCount',
              },
              {
                title: '线索已转化',
                field: 'changedCount',
              },
              {
                title: '正式客户新增',
                field: 'sapNewCreateCount',
              },
              {
                title: '项目新增',
                field: 'projectNewCount',
              },
            ].map((d) => ({ ...d, key: d.field }))
          "
          :table-data="list.map((d, i) => ({ ...d, index: i + 1 }))"
          :maxHeight="'calc(100vh - 209px)'"
        />
        <div v-if="list.length <= 0" style="line-height: 96px; text-align: center; font-size: 12px; color: #aaaaaa">
          暂无数据
        </div>
      </template>
    </template>

    <template>
      <v-chart v-show="salesmanTab" class="chart" :option="option" />
    </template>

    <salesman-item-detail
      :date="date"
      :visible.sync="itemVisible"
      :reportQuery="itemQuery"
      :loginNameList="itemValue.loginName"
    />
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';
import reportMixin from '../mixins/report';

import salesmanItemDetail from '../components/report/salesman-item-detail';
const listMixin = buildListMixin({
  properties: [{ key: 'sortDir', value: 'desc' }],
  relation: ['reportQuery'],
  getData: async (_, query) => {
    const { pageNo, pageSize, reportQuery } = _;

    const targetQuery = {
      endTime: reportQuery.endTime,
      startTime: reportQuery.startTime,
      monthOrWeek: reportQuery.monthOrWeek,
      businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
    };
    _.handleVariable(reportQuery.text);
    _.salesmanText = reportQuery.text;
    if (!!reportQuery.sortBy && query.sortDir) {
      targetQuery.sort = `${reportQuery.sortBy}@${query.sortDir}`;
    }

    _.itemQuery = targetQuery;

    const data = await api.report.getSalesmanList(targetQuery);

    const currentIndex = (pageNo - 1) * pageSize;
    let salesman = data.slice(0, 10).reverse();
    const salesmanName = (salesman || []).map((d) => {
      return d.userName;
    });
    const salesmanData = (salesman || []).map((d) => {
      if (_.salesmanText === '意向客户新增') {
        return d.custNewCreateCount;
      } else if (_.salesmanText === '线索转项目') {
        return d.changedCount;
      } else if (_.salesmanText === '项目新增') {
        return d.projectNewCount;
      } else if (_.salesmanText === '项目新增金额') {
        return d.projectNewSum;
      } else if (_.salesmanText === '有效拜访') {
        return d.validVisitCount;
      } else if (_.salesmanText === '有效跟进线索') {
        return d.validClueFollowCount;
      } else {
        return '-';
      }
    });
    _.option = {
      yAxis: { data: salesmanName },

      series: [
        {
          name: _.salesmanText,
          data: salesmanData,
        },
      ],
    };
    _.salesman = salesman;
    return Promise.resolve({
      data: data.slice(currentIndex, currentIndex + pageSize),
      totalSize: data.length,
    });
  },
});
export default {
  mixins: [reportMixin, listMixin, formatMixin],
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const ctx = this;
    return {
      pageSize: 50,
      switchTable: false,
      itemValue: {},
      itemVisible: false,
      itemQuery: {},
      salesmanText: '-',
      salesmanValeu: '-',
      salesmanReport: false,
      salesmanTab: false,
      salesman: [],
      option: {
        top: 0,
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
          // name: '万', //坐标名字
          nameLocation: 'end', //坐标位置，支持start,end，middle
          type: 'value',
          boundaryGap: [0, 0.01],
          nameLocation: 'end', //坐标轴名称显示位置。
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0,
            rotate: '0',
          },
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            name: '业务员',
            type: 'bar',
            barCategoryGap: '50%',
            label: {
              normal: {
                show: true, //是否显示
                position: 'right', //文字位置
                formatter: '{c}', //c后面加单位
                // formatter: function (p) {
                //   return `${(ctx.salesman[p.dataIndex].).toFixed(2)};${
                //     ctx.salesman[p.dataIndex].fdPercentage
                //   }`;
                // },
              },
            },
          },
        ],
      },
    };
  },
  components: {
    salesmanItemDetail,
  },
  methods: {
    handleDetail(item) {
      this.itemValue = item;
      this.itemVisible = true;
    },
    handleEcharts() {
      this.salesmanTab = !this.salesmanTab;
      this.switchTable = false;
    },
    handleSwitchTable() {
      this.switchTable = !this.switchTable;
      this.salesmanTab = false;
    },
    handleVariable(value) {
      switch (value) {
        case '意向客户新增':
          this.salesmanValeu = 'custNewCreateCount';
          break;
        case '线索转项目':
          this.salesmanValeu = 'changedCount';
          break;
        case '项目新增':
          this.salesmanValeu = 'projectNewCount';
          break;
        case '项目新增金额':
          this.salesmanValeu = 'projectNewSum';
          break;
        case '有效拜访':
          this.salesmanValeu = 'validVisitCount';
          break;
        case '有效跟进线索':
          this.salesmanValeu = 'validClueFollowCount';
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.report-salesman {
  .chart {
    height: 300px;
    width: 100vw;
  }
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
  .salesman {
    color: #666666;
    box-shadow: 0 0 12px rgba(100, 101, 102, 0.18);
    margin: 8px;
    padding: 8px;
    overflow-x: auto;
    table {
      width: 100%;
    }
    tr,
    td {
      white-space: nowrap;
      padding: 2px 4px;
      font-size: 12px;
    }
  }

  .salesman-table {
    /deep/ th,
    /deep/ td {
      font-size: 12px !important;
      white-space: nowrap;
    }
  }
}
</style>
