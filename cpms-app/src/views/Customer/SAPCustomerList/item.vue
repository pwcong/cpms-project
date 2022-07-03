<template>
  <div class="customer-item" @click="handleDetail(tempValue.id)">
    <div class="left">
      <div class="title">
        {{ tempValue.fdSapCustName ? tempValue.fdSapCustName : '--' }}
      </div>
      <div class="info">
        <span>客户编码: </span>
        <span>{{ tempValue.fdSapNumber }}</span>
      </div>
      <div class="info">
        <span>增值税登记号: </span>
        <span>
          {{ tempValue.fdSapUnifiedCode ? tempValue.fdSapUnifiedCode : '--' }}
        </span>
      </div>
      <div class="info">
        <span>省市县信息: </span>
        <span>
          {{ tempValue.fdSapProvince ? tempValue.fdSapProvince : '' }}{{ tempValue.fdSapCity ? tempValue.fdSapCity : ''
          }}{{ tempValue.fdSapCounty ? tempValue.fdSapCounty : '' }}
        </span>
      </div>
      <div class="info" v-if="tempValue.fdCustType">
        <span>客户类型: </span>
        <span>
          <dict-text :value="(tempValue.fdCustType || '').split(',')" dictCode="cpms_cust_type" systemCode="cpms" />
        </span>
      </div>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdSapStatus">
        {{ tempValue.fdSapStatus | foramtStatus }}
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
  </div>
</template>

<script>
import api from '@/api';
import formMixin from '../SAPCustomerEdit/form';
import { buildSelectionMixin, formatMixin, userMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';

import CancelOperation from '../components/operation/cancel';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'customer-item',
  mixins: [selectionMixin, formatMixin, commonMixin, userMixin, formMixin],
  components: {
    CancelOperation,
    StatusTag,
  },
  data() {
    return {
      invalidReasons: {
        id: '',
        version: '',
      },
      cancelVisible: false,
      showAction: false,
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
          key: 'reject',
          name: '驳回原因',
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
        case 'fail':
          return '审批驳回';
        default:
          return v;
      }
    },
  },
  methods: {
    handleValid() {
      this.cancelVisible = true;
      this.invalidReasons.id = this.tempValue.id;
      this.invalidReasons.version = this.tempValue.version;
      this.invalidReasons.action = 'valid';
    },
    handleDelete() {
      this.$dialog
        .confirm({
          title: '请确认是否要删除此客户?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.customer.deleteDeleteSapCustomer(this.tempValue.id);
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
    handleRefresh() {
      this.$emit('change');
    },
    handleAction(action) {
      switch (action.key) {
        case 'edit':
          this.handleEdit(this.tempValue.id);
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
        case 'reject':
          this.handleReject();
          break;
        default:
          break;
      }

      this.showAction = false;
    },
    call() {
      if (!this.tempValue.fdSapPhone && !this.tempValue.fdSapMobile) {
        // 暂无客户联系人
        this.$toast.fail('暂无客户联系人');
      } else {
        this.$nativeApi.financeCall(
          !!this.tempValue.fdSapMobile ? this.tempValue.fdSapMobile : this.tempValue.fdSapPhone
        );
      }
    },
    handleReject() {
      this.$dialog
        .alert({
          title: '审批驳回',
          message: '驳回原因请前往财务共享系统查看。',
        })
        .then(() => {
          // on close
        });
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
