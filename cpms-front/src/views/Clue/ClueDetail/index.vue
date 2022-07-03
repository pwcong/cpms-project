<template>
  <p-spin :spinning="loading">
    <list-layout class="page-clue-edit" style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>线索管理</p-breadcrumb-item>
              <p-breadcrumb-item> 线索详情 </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleEdit(id)"
              v-if="
                checkButton(formData, 'edit') &&
                checkQueryType(['followBy', 'createBy', 'pool'])
              "
            >
              编辑
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="
                checkButton(formData, 'allot') &&
                checkQueryType(['followBy', 'createBy', 'pool'])
              "
              @click="
                (selectedId = formData.id) &&
                  (distributeVisible = true) &&
                  (version = formData.version)
              "
            >
              分配
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="
                checkButton(formData, 'release') &&
                checkQueryType(['followBy', 'createBy'])
              "
              @click="
                (selectedId = formData.id) &&
                  (releaseVisible = true) &&
                  (version = formData.version)
              "
            >
              释放
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="
                checkButton(formData, 'follow') &&
                checkQueryType(['followBy', 'createBy', 'disabled', 'pool'])
              "
              @click="
                (selectedId = formData.id) &&
                  (claimVisible = true) &&
                  (version = formData.version)
              "
            >
              认领
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleVisit(record.id)"
              v-if="
                checkButton(formData, 'visit') && checkQueryType(['followBy', 'disabled'])
              "
            >
              拜访
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="
                checkButton(formData, 'discard') &&
                checkQueryType(['followBy', 'createBy'])
              "
              @click="
                (selectedId = formData.id) &&
                  (cancelVisible = true) &&
                  (version = formData.version)
              "
            >
              作废
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="checkButton(formData, 'del')"
              @click="handleDelete(formData)"
            >
              删除
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              v-if="checkButton(formData, 'followUp') && checkQueryType(['followBy'])"
              @click="
                (selectedId = formData.id) &&
                  (followUpVisible = true) &&
                  (version = formData.version)
              "
            >
              跟进
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleCustomers(record.id)"
              v-if="
                checkButton(formData, 'changeCust') &&
                checkQueryType(['followBy', 'createBy'])
              "
            >
              转客户
            </p-button>
            <p-button
              style="margin-right: 8px"
              type="primary"
              @click="handleProject(record.id)"
              v-if="
                checkButton(formData, 'changeProject') &&
                checkQueryType(['followBy', 'createBy'])
              "
            >
              转项目
            </p-button>
            <p-button @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block title="线索信息" style="margin-top: 16px" theme="primary">
          <template #action>
            <status-seal :status="formData.fdClueStatus">
              {{ formData.fdClueStatus | foramtStatus }}
            </status-seal>
            <barcode :value="formData.fdNumber" />
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="线索名称" prop="fdClueName">
                <p-input v-model="formData.fdClueName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="线索描述" prop="fdClueDescription">
                <p-textarea
                  v-model="formData.fdClueDescription"
                  :autoSize="{
                    minRows: 4,
                  }"
                  read-only
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="终端客户名称">
                <p-input read-only v-model="formData.fdTerminalClient" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索来源" prop="fdClueSource">
                <select-dict
                  read-only
                  systemCode="cpms"
                  dictCode="cpms_clue_source"
                  :value="
                    !!formData.fdClueSource ? [{ value: formData.fdClueSource }] : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索联系人" prop="fdClueContactName">
                <p-input read-only v-model="formData.fdClueContactName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系方式" prop="fdClueContactMobile">
                <p-input read-only v-model="formData.fdClueContactMobile" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="所属区域" prop="fdCityCode">
                <div style="display: flex">
                  <select-province
                    style="flex: 1"
                    read-only
                    :value="
                      !!formData.fdProvinceCode
                        ? [
                            {
                              value: formData.fdProvinceCode,
                              text: formData.fdProvinceName,
                            },
                          ]
                        : []
                    "
                  />
                  <select-city
                    style="flex: 1; margin-left: 4px"
                    :province-code="formData.fdProvinceCode"
                    read-only
                    :value="
                      !!formData.fdCityCode
                        ? [
                            {
                              value: formData.fdCityCode,
                              text: formData.fdCityName,
                            },
                          ]
                        : []
                    "
                  />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="产品线" prop="productLineList">
                <select-product-line
                  :value="
                    formData.productLineList.map((d) => ({
                      text: d.fdProductLineName,
                      value: d.fdProductLineCode,
                    }))
                  "
                  read-only
                  multiple
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索类型" prop="fdClueType">
                <select-dict
                  read-only
                  systemCode="cpms"
                  dictCode="cpms_clue_type"
                  :value="
                    !!formData.fdClueType
                      ? [
                          {
                            text: formData.fdClueTypeName,
                            value: formData.fdClueType,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="所属机构" prop="fdAgencyCode">
                <p-input :value="formData.fdAgencyName" read-only />
              </p-form-model-item>
            </p-col>

            <!-- <p-col :span="8">
            <p-form-model-item label="线索标签">
              <p-input read-only />
            </p-form-model-item>
          </p-col> -->

            <p-col :span="8">
              <p-form-model-item label="代理商名称" prop="fdCustName">
                <p-input read-only v-model="formData.fdCustName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="跟进人" prop="fdLoginName">
                <p-input :value="formData.fdUserName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="招标编号 " prop="fdBiddingNumber">
                <p-input v-model="formData.fdBiddingNumber" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="12">
              <p-form-model-item
                label="可见范围-人员"
                prop="sysDatascopePersonAspectParams"
              >
                <p-input
                  :value="
                    formData.sysDatascopePersonAspectParams
                      .map((d) => d.fdPersonName)
                      .join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item
                label="可见范围-部门"
                prop="sysDatascopeDeptAspectParams"
              >
                <p-input
                  :value="
                    formData.sysDatascopeDeptAspectParams
                      .map((d) => d.fdDeptName)
                      .join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="备注" prop="fdOtherRemark">
                <p-textarea
                  v-model="formData.fdOtherRemark"
                  :autoSize="{
                    minRows: 4,
                  }"
                  read-only
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block title="客户详情" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdCustIndustry">
                <select-dict
                  read-only
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司类型" prop="fdCompanyType">
                <p-input v-model="formData.fdCompanyType" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="电话" prop="fdCustContactPhone">
                <p-input v-model="formData.fdCustContactPhone" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="手机" prop="fdCustContactMobile">
                <p-input v-model="formData.fdCustContactMobile" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="网址" prop="fdCompanyWeb">
                <p-input v-model="formData.fdCompanyWeb" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="成立时间" prop="fdCompanyRegtime">
                <p-input v-model="formData.fdCompanyRegtime" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司总人数" prop="fdTotalCount">
                <p-input :value="formData.fdTotalCount" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="年度销量" prop="fdSalesVolumeint">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_cust_sales_volumeint"
                  :value="
                    !!formData.fdSalesVolumeint
                      ? [{ value: formData.fdSalesVolumeint }]
                      : []
                  "
                  readOnly
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="年度采购额" prop="fdPurchaseAmount">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_cust_purchase_amount"
                  :value="
                    !!formData.fdPurchaseAmount
                      ? [{ value: formData.fdPurchaseAmount }]
                      : []
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="旗下品牌" prop="fdBrand">
                <p-input v-model="formData.fdBrand" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关键部门" prop="fdKeyDept">
                <p-input v-model="formData.fdKeyDept" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册资本" prop="fdRegCapital ">
                <p-input v-model="formData.fdRegCapital" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="企业状态 " prop="fdRegStatus">
                <p-input v-model="formData.fdRegStatus" read-only />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="用户群体" prop="fdUserCommunity">
                <p-textarea
                  v-model="formData.fdUserCommunity"
                  read-only
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <more-info style="margin-top: 16px" :value="formData" />

        <!--其他联系人-->
        <!-- <contact-list readOnly :moduleId="id" v-model="formData" /> -->

        <!-- 客户办公地址 -->
        <!-- <address-list readOnly :moduleId="id" v-model="formData" /> -->

        <div style="margin-top: 16px">
          <p-tabs
            style="padding: 12px 16px; box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2)"
          >
            <p-tab-pane key="1" tab="其他联系人">
              <contact-list readOnly v-model="formData" />
            </p-tab-pane>
            <p-tab-pane key="2" tab="办公地址">
              <address-list readOnly v-model="formData" />
            </p-tab-pane>
            <p-tab-pane key="3" tab="跟进记录">
              <follow-record :moduleId="id" moduleFlag="cpms_clue_main" />
            </p-tab-pane>
            <p-tab-pane key="4" tab="操作记录">
              <modify-record :moduleId="id" moduleFlag="cpms_clue_main" />
            </p-tab-pane>
          </p-tabs>
        </div>
      </p-form-model>
      <!-- 分配 -->
      <distribute-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="distributeVisible"
        @change="onRefresh"
      />
      <!-- 认领 -->
      <claim-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="claimVisible"
        @change="onRefresh"
      />
      <!-- 释放 -->
      <release-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="releaseVisible"
        @change="onRefresh"
      />
      <!-- 作废 -->
      <cancel-operation
        :moduleId="selectedId"
        :version="version"
        :visible.sync="cancelVisible"
        @change="onRefresh"
      />
      <!-- 跟进 -->
      <fdrecord-operation
        :moduleId="selectedId"
        :visible.sync="followUpVisible"
        @change="onRefresh"
      />
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import AddressList from '../ClueEdit/address-list';
import formMixin from '../ClueEdit/form';
import { formatMixin } from '@/mixins';
import ContactList from '../ClueEdit/contact-list';
import ModifyRecord from '@/views/components/modify-record';
import FollowRecord from '@/views/components/follow-record';

import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectProductLine from '@/views/components/select/product-line';
import MoreInfo from '@/views/components/more-info';
import { commonMixin } from '@/views/mixins';

import DistributeOperation from '../components/operations/distribute';
import ReleaseOperation from '../components/operations/release';
import CancelOperation from '../components/operations/cancel';
import ClaimOperation from '../components/operations/claim';
import FdrecordOperation from '../components/operations/fdrecord';
export default {
  name: '线索详情',
  mixins: [formMixin, formatMixin, commonMixin],
  components: {
    AddressList,
    ContactList,
    FollowRecord,
    ModifyRecord,
    SelectProvince,
    SelectCity,
    SelectProductLine,
    MoreInfo,
    DistributeOperation,
    ReleaseOperation,
    CancelOperation,
    ClaimOperation,
    FdrecordOperation,
  },
  data() {
    const { id } = this.$route.params;

    const { queryType } = this.$route.query;
    return {
      id,
      queryType,
      distributeVisible: false,
      releaseVisible: false,
      cancelVisible: false,
      claimVisible: false,
      followUpVisible: false,
      inited: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
  methods: {
    checkQueryType(queryBys = []) {
      return queryBys.indexOf(this.queryType) > -1;
    },
    // 跳转拜访页
    handleVisit(record) {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
    // 跳转客户
    handleCustomers(record) {
      this.$router.push({
        path: '/Customer/InterdCustomerCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
    // 跳转项目
    handleProject(record) {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
    // 删除按钮
    handleDelete(record) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: async () => {
          await api.clue.putClueDelete({
            id: record.id,
            fdIsValid: '0',
            version: record.version,
          });
          this.$message.success('删除成功');
          // this.onRefresh();
          this.handleCancel();
        },
        onCancel: () => {},
      });
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待处理';
        case 'follow':
          return '跟进中';
        case 'discard':
          return '作废';
        case 'changing':
          return '转化中';
        case 'changed':
          return '已转化';
        case 'draft':
          return '暂存';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
