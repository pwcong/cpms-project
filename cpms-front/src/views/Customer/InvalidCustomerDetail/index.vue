<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
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
              <p-breadcrumb-item>客户管理</p-breadcrumb-item>
              <p-breadcrumb-item> 客户详情 </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleEdit(id)"
              v-if="checkButton(formData, 'edit') && checkType(['interd'])"
            >
              编辑
            </p-button>

            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleVisit"
              v-if="checkButton(formData, 'visit') && checkType(['interd'])"
            >
              拜访
            </p-button>

            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleValid"
              v-if="checkButton(formData, 'isValid') && checkType(['interd'])"
            >
              作废
            </p-button>

            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleDelete"
              v-if="checkButton(formData, 'delete') && checkType(['interd'])"
            >
              删除
            </p-button>

            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleFormal"
              v-if="checkButton(formData, 'toSap') && checkType(['interd'])"
            >
              转SAP
            </p-button>

            <p-button
              type="primary"
              style="margin-left: 8px"
              v-if="checkButton(formData, 'toProject') && checkType(['interd'])"
              @click="handleTransferProject"
            >
              转项目
            </p-button>
            <p-button
              type="primary"
              style="margin-left: 8px"
              v-if="formData.fdIsValid === '0' && checkType(['invalid'])"
              @click="handleClaim"
              :loading="loading"
            >
              认领
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel">返回</p-button>
          </template>
        </block>
        <block style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span style="font-size: 16px; color: #333333">客户详情</span>
              <p-button-link
                type="primary"
                @click="checkSkyeyeDetail"
                v-if="!!formData.fdCustName && !!formData.fdEnterpriseId"
                style="margin-left: 8px"
              >
                查看天眼查客户详情
              </p-button-link>
            </div>
          </template>
          <template #action>
            <status-seal :status="formData.fdStatus">
              {{ formData.fdStatus | foramtStatus }}
            </status-seal>
            <barcode title="客户编码" :value="formData.fdNumber" />
          </template>

          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="客户名称" prop="fdCustName">
                <p-input :value="formData.fdCustName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="统一社会信用代码" prop="fdUnifiedCode">
                <p-input v-model="formData.fdUnifiedCode" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户类型" prop="fdCustType">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_cust_type"
                  :value="!!formData.fdCustType ? [{ value: formData.fdCustType }] : []"
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdCustIndustry">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司类型" prop="fdCompanyType">
                <p-input :value="formData.fdCompanyType" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册资金" prop="fdCompanyRegassets">
                <p-input v-model="formData.fdCompanyRegassets" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="经营状态" prop="fdCustManageforms">
                <p-input readOnly v-model="formData.fdCustManageforms" />
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
              <p-form-model-item label="公司总人数" prop="fdTotalCount">
                <p-input v-model="formData.fdTotalCount" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="成立时间" prop="fdCompanyRegtime">
                <p-input v-model="formData.fdCompanyRegtime" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册地址" prop="fdRegLocation">
                <p-input v-model="formData.fdRegLocation" readOnly />
              </p-form-model-item>
            </p-col>
            <!-- <p-col :span="8">
            <p-form-model-item label="国家" prop="fdCountry">
              <p-select
                allowClear
                v-model="formData.fdCountry"
                @change="handleChange"
              >
                <p-select-option value="中国">
                  中国
                </p-select-option>
                <p-select-option value="国外">
                  国外
                </p-select-option>
              </p-select>
            </p-form-model-item>
          </p-col> -->
            <p-col :span="8">
              <p-form-model-item label="注册省份" prop="fdProvince">
                <p-input v-model="formData.fdProvince" readOnly />
                <!-- <select-province
                style="flex: 1"
                v-model="formData.fdProvince"
                allow-clear
                @change="formData.fdCity = []"
              /> -->
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册城市" prop="fdCity">
                <p-input v-model="formData.fdCity" readOnly />
                <!-- <select-city
                style="flex: 1; margin-left: 4px"
                :province-code="(formData.fdProvince[0] || {}).value"
                v-model="formData.fdCity"
                allow-clear
              /> -->
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户来源" prop="fdCustSource">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_clue_source"
                  :value="
                    !!formData.fdCustSource ? [{ value: formData.fdCustSource }] : []
                  "
                  readOnly
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="渠道信息" prop="fdChannel">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_comtomer_channel"
                  :value="
                    (formData.fdChannel || '')
                      .split(';')
                      .filter((v) => !!v)
                      .map((v) => ({
                        value: v,
                      }))
                  "
                  readOnly
                  multiple
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="营业执照" prop="sysAttContractAspectParams">
                <uploader
                  readOnly
                  v-model="formData.sysAttContractAspectParams"
                  multiple
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="客户情况简介" prop="fdCustProfile">
                <p-textarea
                  v-model="formData.fdCustProfile"
                  :autoSize="{
                    minRows: 4,
                  }"
                  readOnly
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="关联业务员" prop="fdUserName">
                <p-input :value="formData.fdUserName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关联代理商" prop="fdAgentId">
                <select-affiliated-agents
                  :id="id"
                  read-only
                  :value="
                    !!formData.fdAgentId
                      ? [
                          {
                            value: formData.fdAgentId,
                            text: formData.fdAgentName,
                          },
                        ]
                      : []
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="共享人员" prop="sysDatascopePersonAspectParams">
                <p-input
                  :value="
                    formData.sysDatascopePersonAspectParams.map((d) => d.name).join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item
                label="共享部门（部门内所有人员可见）"
                prop="sysDatascopeDeptAspectParams"
              >
                <p-input
                  :value="
                    formData.sysDatascopeDeptAspectParams.map((d) => d.name).join(',')
                  "
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否代理商" prop="fdIsAgent">
                <p-input :value="formData.fdIsAgent === '1' ? '是' : '否'" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <more-info style="margin-top: 16px" :value="formData" />

        <audit-info style="margin-top: 16px" :moduleId="id" moduleFlag="cpms_cust_main" />

        <div style="margin-top: 16px">
          <p-tabs
            style="padding: 12px 16px; box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2)"
          >
            <p-tab-pane key="1" tab="客户联系人">
              <contact-list
                readOnly
                v-model="formData"
                title="false"
                @change="handContact"
              />
            </p-tab-pane>
            <p-tab-pane key="2" tab="办公地址" force-render>
              <address-list
                readOnly
                v-model="formData"
                title="false"
                @change="handAddressList"
              />
            </p-tab-pane>
            <p-tab-pane key="3" tab="项目信息">
              <project-info :moduleId="id" v-model="projectList" />
            </p-tab-pane>
            <p-tab-pane key="4" tab="SAP客户信息">
              <regular-customers />
            </p-tab-pane>
            <p-tab-pane key="5" tab="跟进记录">
              <follow-record :moduleId="id" moduleFlag="cpms_cust_main" />
            </p-tab-pane>
            <p-tab-pane key="6" tab="操作记录">
              <modify-record :moduleId="id" moduleFlag="cpms_cust_main" />
            </p-tab-pane>
            <p-tab-pane key="7" tab="审批记录">
              <audit-record :moduleId="id" moduleFlag="cpms_cust_main" />
            </p-tab-pane>
          </p-tabs>
        </div>
        <!-- 作废、删除弹窗 -->
        <cancel-operation
          :invalidReasons="invalidReasons"
          :visible.sync="cancelVisible"
          :action="action"
          @change="onRefresh"
        />
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import formMixin from '../InterdCustomerEdit/form';
import { formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';

import ContactList from '../InterdCustomerEdit/contact-list';
import AddressList from '../InterdCustomerEdit/address-list';
import FollowRecord from '@/views/components/follow-record';
import ModifyRecord from '@/views/components/modify-record';
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import ProjectInfo from '../InterdCustomerDetail/project-info.vue';
import RegularCustomers from '../InterdCustomerDetail/regular-customers';
import SelectAffiliatedAgents from '../components/select/affiliated-agents';
import MoreInfo from '@/views/components/more-info';
import CancelOperation from '../components/operations/cancel';

export default {
  name: '客户详情',
  mixins: [formMixin, formatMixin, commonMixin],
  data() {
    const { id } = this.$route.params;
    const { type } = this.$route.query;
    return {
      id,
      type,
      loading: false,
      visible: false,
      projectList: [],
      invalidReasons: {
        id: '',
        version: '',
        action: '',
      },
      cancelVisible: false,
      inited: false,
    };
  },
  components: {
    ContactList,
    AddressList,
    AuditInfo,
    FollowRecord,
    ModifyRecord,
    ProjectInfo,
    AuditRecord,
    RegularCustomers,
    SelectAffiliatedAgents,
    MoreInfo,
    CancelOperation,
  },
  created() {
    this.initFormData(this.id);
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        default:
          return v;
      }
    },
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
  methods: {
    checkType(types = []) {
      return types.indexOf(this.type) > -1;
    },
    handleVisit() {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'customer',
          targetId: this.id,
        },
      });
    },
    handleValid() {
      this.cancelVisible = true;
      this.invalidReasons.id = this.id;
      this.invalidReasons.version = this.formData.version;
      this.invalidReasons.action = 'valid';
    },
    handleDelete() {
      this.cancelVisible = true;
      this.invalidReasons.id = this.id;
      this.invalidReasons.version = this.formData.version;
      this.invalidReasons.action = 'delete';
    },
    handleFormal() {
      this.$router.push({
        path: `/Customer/SAPCustomerCreate`,
        query: {
          fdCustMainId: this.id,
          fdEnterpriseId: this.formData.fdEnterpriseId,
        },
      });
    },
    handleTransferProject() {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'customer',
          targetId: this.id,
        },
      });
    },
    onRefresh() {
      this.initFormData(this.id);
    },
    checkSkyeyeDetail() {
      this.$router.push({
        path: `/Customer/TianyanchaDetail`,
        query: {
          id: this.formData.fdEnterpriseId,
          version: this.formData.version,
          customerId: this.id,
        },
      });
    },
    handleClaim() {
      this.$confirm({
        title: '是否认领该客户?',
        onOk: async () => {
          this.loading = true;
          try {
            const claimCust = {
              id: this.formData.id,
              version: this.formData.version,
            };
            await api.customer.postClaimCustomer(claimCust);
            this.$message.success('认领成功');
            setTimeout(() => {
              this.$router.back(true);
            }, 300);
          } catch (e) {
            console.error(e);
          } finally {
            this.loading = false;
          }
        },
        onCancel: () => {},
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
