<template>
  <list-layout>
    <block>
      <template v-slot:title>
        <p-breadcrumb>
          <p-breadcrumb-item>首页</p-breadcrumb-item>
          <p-breadcrumb-item>商机管理</p-breadcrumb-item>
          <p-breadcrumb-item> 项目跟进 </p-breadcrumb-item>
        </p-breadcrumb>
      </template>
      <template v-slot:action>
        <p-button
          style="margin-right: 8px"
          type="primary"
          @click="handleTransferOrder(formData.fdName, id)"
          v-if="checkButton(formData, 'order')"
        >
          转订单
        </p-button>
        <p-button
          type="primary"
          @click="handleEdit(id)"
          v-if="checkButton(formData, 'edit')"
        >
          编辑
        </p-button>
        <!-- <p-button
          style="margin-left: 8px;"
          type="primary"
          @click="showProjectQuery = true"
        >
          查看相似项目
        </p-button> -->
        <p-button
          style="margin-left: 8px"
          type="primary"
          @click="handleVisit"
          v-if="checkButton(formData, 'visit')"
        >
          拜访项目
        </p-button>
        <p-button
          style="margin-left: 8px"
          type="primary"
          v-if="checkButton(formData, 'close')"
          @click="showProjectClose = true"
        >
          关闭项目
        </p-button>
        <p-dropdown>
          <p-button type="primary" style="margin-left: 8px"> 其他操作 </p-button>
          <p-menu slot="overlay">
            <p-menu-item @click="showChangeManager = true"> 更换责任人 </p-menu-item>
            <!-- <p-menu-item>
              更换代理商
            </p-menu-item> -->
            <p-menu-item @click="toConvert('grant')"> 转授权 </p-menu-item>
            <p-menu-item @click="toConvert('price')"> 转价格 </p-menu-item>
            <p-menu-item @click="toConvert('contract')"> 转合同 </p-menu-item>
          </p-menu>
        </p-dropdown>

        <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
      </template>
    </block>

    <follow-panel :value="formData" style="margin-top: 16px" @change="initData" />

    <p-form-model
      ref="form"
      :model="formData"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <block title="项目关键信息" style="margin-top: 16px" theme="primary">
        <p-row style="margin-top: 16px" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="项目名称" prop="fdName">
              <p-input v-model="formData.fdName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="客户/代理商" prop="fdCustName">
              <p-input v-model="formData.fdCustName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="关联线索" prop="fdClueName">
              <p-input v-model="formData.fdClueName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="所属行业" prop="fdBusinessName">
              <select-dict
                read-only
                systemCode="cpms"
                dictCode="cpms_business"
                :value="
                  !!formData.fdBusinessCode
                    ? [
                        {
                          value: formData.fdBusinessCode,
                        },
                      ]
                    : []
                "
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="项目预算(元)" prop="fdProjectSum">
              <p-input v-model="formData.fdProjectSum" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="产品线" prop="fdProductLineName">
              <p-input
                read-only
                :value="
                  (formData.productListParams || [])
                    .map((d) => d.fdProductLineName)
                    .filter(
                      (d, i) =>
                        (formData.productListParams || []).findIndex(
                          (_d) => _d.fdProductLineName === d
                        ) === i
                    )
                    .join(';')
                "
              />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>

      <p-tabs
        style="
          margin-top: 16px;
          padding: 12px 16px;
          box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2);
        "
      >
        <p-tab-pane key="project-panel" tab="项目信息">
          <project-panel v-model="formData" />
        </p-tab-pane>
        <p-tab-pane key="contact-panel" tab="项目干系人">
          <party-list readOnly v-model="formData" />
        </p-tab-pane>
        <p-tab-pane key="address-panel" tab="项目地址">
          <address-list readOnly v-model="formData" />
        </p-tab-pane>
        <p-tab-pane key="product-panel" tab="产品信息">
          <product-list readOnly v-model="formData" />
        </p-tab-pane>

        <p-tab-pane key="visit-panel" tab="拜访信息">
          <visit-panel :moduleId="id" />
        </p-tab-pane>
        <p-tab-pane key="accredit-panel" tab="授权信息">
          <grant-panel :moduleId="id" />
        </p-tab-pane>
        <p-tab-pane key="price-panel" tab="价格信息">
          <price-panel :moduleId="id" />
        </p-tab-pane>
        <p-tab-pane key="contract-panel" tab="合同信息">
          <contract-panel :moduleId="id" />
        </p-tab-pane>
        <p-tab-pane key="audit-panel" tab="审批记录">
          <audit-record readOnly :moduleId="id" moduleFlag="cpms_project_main" />
        </p-tab-pane>
        <p-tab-pane key="modify-panel" tab="操作记录">
          <modify-record readOnly :moduleId="id" moduleFlag="cpms_project_main" />
        </p-tab-pane>
        <!-- <p-tab-pane key="sales-panel" tab="销售单信息">
          <sales-order-record
            readOnly
            :moduleId="id"
            :mainId="id"
            moduleFlag="cpms_project_main"
          />
        </p-tab-pane> -->
      </p-tabs>
    </p-form-model>

    <project-close
      :moduleId="id"
      :visible.sync="showProjectClose"
      @change="handleCancel"
    />
    <project-query
      :searchable="false"
      :projectName="formData.fdName"
      :visible.sync="showProjectQuery"
    />
    <project-change-manager
      :value="formData"
      :moduleId="id"
      :visible.sync="showChangeManager"
      @change="handleCancel"
    />
  </list-layout>
</template>

<script>
import formMixin from './form';

import FollowPanel from './follow-panel';
import ProjectPanel from './project-panel';
import GrantPanel from './grant-panel';
import PricePanel from './price-panel';
import ContractPanel from './contract-panel';
import VisitPanel from './visit-panel';

import PartyList from '../ProjectEdit/party-list';
import AddressList from '../ProjectEdit/address-list';
import ProductList from '../ProjectEdit/product-list';

import ProjectClose from '../components/project-close';
import ProjectQuery from '../components/project-query';
import ProjectChangeManager from '../components/project-change-manager';
import AuditRecord from '@/views/components/audit-record';
import ModifyRecord from '@/views/components/modify-record';
import { commonMixin } from '@/views/mixins';

// import SalesOrderRecord from '@/views/components/salesorder-record';

export default {
  name: '项目跟进',
  mixins: [formMixin, commonMixin],
  components: {
    FollowPanel,
    ProjectPanel,
    GrantPanel,
    PricePanel,
    ContractPanel,
    PartyList,
    AddressList,
    ProductList,
    ProjectClose,
    ProjectQuery,
    ProjectChangeManager,
    VisitPanel,
    AuditRecord,
    ModifyRecord,
    // SalesOrderRecord,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showProjectClose: false,
      showProjectQuery: false,
      showChangeManager: false,
      inited: false,
    };
  },
  created() {
    this.initData();
  },
  activated() {
    if (this.inited) {
      this.initData();
    } else {
      this.inited = true;
    }
  },
  methods: {
    async initData() {
      this.formData.projectStageList = [];
      await this.initFormData(this.id);
      await this.initStageData(this.id);
    },
    handleVisit() {
      this.$router.push({
        path: `/Salesman/Visit/VisitCreate?source=project&targetId=${this.id}`,
      });
    },
    toConvert(type) {
      switch (type) {
        case 'grant':
          this.$router.push({
            path: `/Business/Grant/GrantCreate?source=project&targetId=${this.id}`,
          });
          break;
        case 'price':
          this.$router.push({
            path: `/Business/Price/PriceCreate?source=project&targetId=${this.id}`,
          });
          break;
        case 'contract':
          this.$router.push({
            path: `/Business/Contract/ContractCreate?source=project&targetId=${this.id}`,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
