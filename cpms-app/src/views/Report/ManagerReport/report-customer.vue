<template>
  <div class="report-rank">
    <block theme="card">
      <block>
        <div style="font-size: 12px; color: #999999; text-align: center; padding-top: 5px">
          统计日期: {{ formatDateRange(date.value) }}
        </div>
        <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
        <div v-show="!loading">
          <data-grid
            theme="report"
            style="margin-top: 4px; border-top: 1px solid #dddddd"
            :value="[
              {
                key: 'intentionCustomer',
                title: '意向客户新增',
                value: report.intentionCustomer + '个' || '0',
              },
              {
                key: 'intentionChainRatio',
                title: '环比',
                value: report.intentionChainRatio + '%' || '0',
                chainRatioRiseOrDecline: report.chainRatioRiseOrDecline,
              },
              {
                key: 'customerSum',
                title: '客户总数',
                value: report.customerSum + '个' || '0',
              },
            ]"
          >
            <template v-slot:title="{ item }">
              <span v-if="item.key === 'intentionChainRatio'">
                <span v-if="item.chainRatioRiseOrDecline === 'decline'" style="color: #e50113">
                  <van-icon color="#e50113" name="down" />
                  {{ item.title }}
                </span>
                <span v-else-if="item.chainRatioRiseOrDecline === 'rise'" style="color: #07c160">
                  <van-icon color="#07c160" name="down" style="transform: rotate(180deg)" />
                  {{ item.title }}
                </span>
                <span v-else>
                  {{ item.title }}
                </span>
              </span>
              <span v-else>
                {{ item.title }}
              </span>
            </template>
            <template v-slot:intentionChainRatio="{ item }">
              <span
                :style="{
                  color:
                    item.chainRatioRiseOrDecline === 'decline'
                      ? '#e50113'
                      : item.chainRatioRiseOrDecline === 'rise'
                      ? '#07c160'
                      : undefined,
                }"
              >
                {{ item.value }}
              </span>
            </template>
          </data-grid>
          <data-grid
            theme="report"
            style="margin-top: 4px"
            :value="[
              {
                key: 'officialCustomer',
                title: '正式客户新增',
                value: report.officialCustomer + '个' || '0',
              },
              {
                key: 'officialChainRatio',
                title: '环比',
                value: report.officialChainRatio + '%' || '0',
                chainRatioFlag: report.chainRatioFlag,
              },
              {
                key: 'custVisitNumber',
                title: '有效拜访客户',
                value: report.custVisitNumber + '个' || '0',
              },
            ]"
          >
            <template v-slot:title="{ item }">
              <span v-if="item.key === 'officialChainRatio'">
                <span v-if="item.chainRatioFlag === 'decline'" style="color: #e50113">
                  <van-icon color="#e50113" name="down" />
                  {{ item.title }}
                </span>
                <span v-else-if="item.chainRatioFlag === 'rise'" style="color: #07c160">
                  <van-icon color="#07c160" name="down" style="transform: rotate(180deg)" />
                  {{ item.title }}
                </span>
                <span v-else>
                  {{ item.title }}
                </span>
              </span>
              <span v-else>
                {{ item.title }}
              </span>
            </template>
            <template v-slot:officialChainRatio="{ item }">
              <span
                :style="{
                  color:
                    item.chainRatioFlag === 'decline'
                      ? '#e50113'
                      : item.chainRatioFlag === 'rise'
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
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>客户行业分布</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              :class="{ active: clientBusinessTab }"
              name="font-o"
              @click="clientBusinessTab = !clientBusinessTab"
            />
          </div>
        </template>

        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'client-business-new', title: '新增' },
              { key: 'client-business-amount', title: '总计' },
            ]"
          >
            <template v-if="!clientBusinessTab">
              <client-business-new slot="client-business-new" :reportQuery="reportQuery"></client-business-new>
              <client-business-amount slot="client-business-amount" :reportQuery="reportQuery"></client-business-amount>
            </template>
            <template v-else>
              <div slot="client-business-new">
                <client-business-new-table :reportQuery="reportQuery"></client-business-new-table>
              </div>
              <div slot="client-business-amount">
                <client-business-amount-table :reportQuery="reportQuery"></client-business-amount-table>
              </div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>客户渠道分布</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              :class="{ active: clientChannelTab }"
              name="font-o"
              @click="clientChannelTab = !clientChannelTab"
            />
          </div>
        </template>

        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'client-channel-new', title: '新增' },
              { key: 'client-channel-amount', title: '总计' },
            ]"
          >
            <template v-if="!clientChannelTab">
              <client-channel-new slot="client-channel-new" :reportQuery="reportQuery"></client-channel-new>
              <client-channel-amount slot="client-channel-amount" :reportQuery="reportQuery"></client-channel-amount>
            </template>
            <template v-else>
              <div slot="client-channel-new">
                <client-channel-new-table :reportQuery="reportQuery"></client-channel-new-table>
              </div>
              <div slot="client-channel-amount">
                <client-channel-amount-table :reportQuery="reportQuery"></client-channel-amount-table>
              </div>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>新增客户商务中心占比</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <template slot="action">
          <div class="report-action">
            <van-icon
              :class="{ active: clientProportionTab }"
              name="font-o"
              @click="clientProportionTab = !clientProportionTab"
            />
          </div>
        </template>

        <div style="margin-top: 8px">
          <template v-if="!clientProportionTab">
            <new-customer-business-center
              slot="new-customer-business-center"
              :reportQuery="reportQuery"
            ></new-customer-business-center>
          </template>
          <template v-else>
            <div slot="new-customer-business-center">
              <new-customer-business-center-table :reportQuery="reportQuery"></new-customer-business-center-table>
            </div>
          </template>
        </div>
      </block>
    </block>
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../mixins/report';

import clientBusinessNew from '../components/report/client-business-new';
import clientBusinessAmount from '../components/report/client-business-amount';
import clientChannelAmount from '../components/report/client-channel-amount';
import clientChannelNew from '../components/report/client-channel-new';
import newCustomerBusinessCenter from '../components/report/new-customer-business-center';
import clientBusinessNewTable from '../components/report/client-business-new-table';
import clientBusinessAmountTable from '../components/report/client-business-amount-table';
import clientChannelNewTable from '../components/report/client-channel-new-table';
import clientChannelAmountTable from '../components/report/client-channel-amount-table';
import newCustomerBusinessCenterTable from '../components/report/new-customer-business-center-table';
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;
    const value = await api.report
      .getCustMainReport({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        fdStatus: 'cust',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    _.report = {
      intentionCustomer: value.intentionCustomer || '0', //意向客户新增
      intentionChainRatio: value.intentionChainRatio || '0', //意向客户环比
      customerSum: value.customerSum || '0', //客户总数
      chainRatioRiseOrDecline: value.chainRatioRiseOrDecline, //意向客户环比上升或下降标识
      officialCustomer: value.officialCustomer || '0', //正式客户新增
      officialChainRatio: value.officialChainRatio || '0', //正式客户环比
      custVisitNumber: value.custVisitNumber || '0', //有效拜访客户数量
      chainRatioFlag: value.chainRatioFlag, //正式客户环比上升或下降标识
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
    clientBusinessNew,
    clientBusinessAmount,
    clientChannelAmount,
    clientChannelNew,
    newCustomerBusinessCenter,
    clientBusinessNewTable,
    clientBusinessAmountTable,
    clientChannelNewTable,
    clientChannelAmountTable,
    newCustomerBusinessCenterTable,
  },
  data() {
    return {
      clientBusinessTab: false,
      clientChannelTab: false,
      clientProportionTab: false,
      report: {
        intentionCustomer: '0', //意向客户新增
        intentionChainRatio: '0', //意向客户环比
        customerSum: '0', //客户总数
        officialCustomer: '0', //正式客户新增
        officialChainRatio: '0', //正式客户环比
        custVisitNumber: '0', //有效拜访客户数量
      },
    };
  },
  methods: {
    handleClientSort(value) {
      this.clientSort = value;
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
