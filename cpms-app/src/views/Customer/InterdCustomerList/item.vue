<template>
  <div class="customer-item" @click="handleDetail(tempValue.id, 'interd')">
    <div class="left">
      <div class="title">
        {{ tempValue.fdCustName ? tempValue.fdCustName : '--' }}
      </div>
      <div class="info">
        <span>客户联系人: </span>
        <span>
          {{
            (tempValue.contactDtoList[0] || {}).fdContactName ? (tempValue.contactDtoList[0] || {}).fdContactName : '--'
          }}
        </span>
      </div>
      <div class="info">
        <span>客户联系电话: </span>
        <span>
          {{
            (tempValue.contactDtoList[0] || {}).fdContactMobile
              ? (tempValue.contactDtoList[0] || {}).fdContactMobile
              : '--'
          }}
        </span>
      </div>
      <div class="info" v-if="tempValue.fdCustIndustry">
        <span>所属行业: </span>
        <span>
          <dict-text :value="(tempValue.fdCustIndustry || '').split(',')" dictCode="cpms_business" systemCode="cpms" />
        </span>
      </div>
      <div class="info" v-if="tempValue.fdCustType">
        <span>客户类型: </span>
        <span>
          <dict-text :value="(tempValue.fdCustType || '').split(',')" dictCode="cpms_cust_type" systemCode="cpms" />
        </span>
      </div>
      <div class="info">
        <span>客户编码: </span>
        <span>{{ tempValue.fdNumber }}</span>
      </div>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | foramtStatus }}
      </status-tag>
    </div>

    <div class="bottom">
      <van-button size="small" v-if="actions.length > 0" type="danger" @click.stop="showAction = true">
        更多操作
      </van-button>
      <van-button size="small" @click.stop="call(tempValue)" icon="phone-o" type="info" />
    </div>

    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      @select="handleAction"
      cancel-text="取消"
      close-on-click-action
      :get-container="getDocumentBody"
    />

    <cancel-operation :invalidReasons="invalidReasons" :visible.sync="cancelVisible" @change="handleRefresh" />

    <maintain-address :moduleId="tempValue.id" :visible.sync="addressVisible" v-model="tempValue" />
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin, userMixin } from '@/mixins';
import { commonMixin, oaMixin } from '@/views/mixins';
import formMixin from '../InterdCustomerEdit/form';
import StatusTag from '@/views/components/status-tag';

import CancelOperation from '../components/operation/cancel';

import MaintainAddress from './maintain-address';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'customer-item',
  mixins: [selectionMixin, formatMixin, commonMixin, oaMixin, userMixin, formMixin],
  components: {
    CancelOperation,
    StatusTag,
    MaintainAddress,
  },
  data() {
    return {
      invalidReasons: {
        id: '',
        version: '',
      },
      cancelVisible: false,
      showAction: false,
      addressVisible: false,
    };
  },
  computed: {
    actions() {
      return [
        {
          key: 'edit',
          name: '编辑',
        },
        {
          key: 'visit',
          name: '拜访',
        },
        {
          key: 'isValid',
          name: '作废',
        },
        {
          key: 'delete',
          name: '删除',
        },
        {
          key: 'toProject',
          name: '转项目',
        },
        {
          key: 'withdrawCust',
          name: '撤回',
        },
        {
          key: 'toSap',
          name: '转Sap',
        },
        {
          key: 'addressMaintain',
          name: '客户地址维护',
        },
      ].filter((d) => this.checkButton(this.tempValue, d.key));
    },
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
  methods: {
    call() {
      if (this.tempValue.contactDtoList.length <= 0) {
        // 暂无客户联系人
        this.$toast.fail('暂无客户联系人');
      } else {
        this.$nativeApi.financeCall(this.tempValue.contactDtoList[0].fdContactMobile);
      }
    },
    handleValid() {
      this.cancelVisible = true;
      this.invalidReasons.id = this.tempValue.id;
      this.invalidReasons.version = this.tempValue.version;
      this.invalidReasons.action = 'valid';
    },
    handleDelete() {
      this.invalidReasons.id = this.tempValue.id;
      this.invalidReasons.version = this.tempValue.version;
      this.invalidReasons.action = 'delete';
      this.$dialog
        .confirm({
          title: '请确认是否要删除此客户?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.customer.putDeleteCustomer({
              ...this.invalidReasons,
            });
            this.$toast.success('客户删除成功');

            this.handleRefresh();
          } finally {
            this.loading = false;
          }
        });
    },
    handleVisit() {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'customer',
          targetId: this.tempValue.id,
        },
      });
    },
    handleTransferProject() {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'customer',
          targetId: this.tempValue.id,
        },
      });
    },
    handleFormal() {
      this.$router.push({
        path: `/Customer/SAPCustomerCreate`,
        query: {
          fdCustMainId: this.tempValue.id,
          fdEnterpriseId: this.tempValue.fdEnterpriseId,
        },
      });
    },
    handleRefresh() {
      this.$emit('change');
    },

    handleAction(action) {
      switch (action.key) {
        case 'edit':
          this.handleEdit(this.tempValue.id, 'interd');
          break;
        case 'visit':
          this.handleVisit();
          break;
        case 'isValid':
          this.handleValid();
          break;
        case 'delete':
          this.handleDelete();
          break;
        case 'toProject':
          this.handleTransferProject();
          break;
        case 'withdrawCust':
          this.handleOAWithdraw(this.tempValue.id, 'cpms_cust_main');
          break;
        case 'toSap':
          this.handleFormal(action);
          break;
        case 'addressMaintain':
          this.addressVisible = true;
          break;
        default:
          break;
      }

      this.showAction = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.customer-item {
  background: #ffffff;
  padding: 10px;
  position: relative;

  &:active {
    background-color: #f5f5f5;
  }

  .left {
    .title {
      font-size: 14px;
      padding-right: 80px;
    }

    .info {
      font-size: 12px;
      color: #666666;
      margin-top: 6px;
    }
  }

  .bottom {
    margin-top: 10px;
    text-align: right;
  }

  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
