<template>
  <div class="project-item" @click="handleDetail(tempValue.id)">
    <div class="left">
      <div class="title">{{ tempValue.fdProjectName || '--' }}</div>
      <div class="desc">
        <span class="descone">创建人: </span>
        <span class="descSpan">{{ tempValue.createByName || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">更新人: </span>
        <span class="descSpan">{{ tempValue.updateByName || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">法人: </span>
        <span class="descSpan">{{ tempValue.fdCorporateName || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">代理商: </span>
        <span class="descSpan">{{ tempValue.fdCustName || '--' }}</span>
      </div>
      <div class="desc">
        <span>单据编号: </span>
        <span>{{ tempValue.fdNumber }}</span>
      </div>
      <div class="desc" v-if="tempValue.fdStatus == 'pass'">
        <span class="descone">完成时间: </span>
        <span class="descSpan">{{ tempValue.updateTime || '--' }}</span>
      </div>
      <div class="desc" v-if="tempValue.fdStatus != 'pass'">
        <span class="descone">创建时间: </span>
        <span class="descSpan">{{ tempValue.createTime || '--' }}</span>
      </div>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus"> {{ tempValue.fdStatus | foramtStatus }}</status-tag>
    </div>

    <div class="bottom">
      <div style="text-align: right; margin-top: 10px">
        <van-button
          size="small"
          type="danger"
          v-if="checkButton(tempValue, 'edit')"
          @click.stop="handleEdit(tempValue.id)"
        >
          编辑
        </van-button>
        <van-button
          size="small"
          type="danger"
          v-if="checkButton(tempValue, 'withdrawGrant')"
          @click.stop="handleOAWithdraw(tempValue.id, 'cpms_project_grant_main')"
        >
          撤回
        </van-button>
        <van-button size="small" type="danger" v-if="checkButton(tempValue, 'edit')" @click.stop="handleDel(tempValue)">
          删除
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import formMixin from '../GrantEdit/form';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import StatusTag from '@/views/components/status-tag';
import { commonMixin, oaMixin } from '@/views/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'grant-item',
  mixins: [selectionMixin, formatMixin, commonMixin, oaMixin, formMixin],
  components: {
    StatusTag,
  },
  methods: {
    // 删除逻辑
    handleDel(record) {
      this.$dialog
        .confirm({
          title: '确认要删除当前行?',
        })
        .then(() => {
          api.grant.delGrantMain({
            id: record.id,
            version: record.version,
            fdIsValid: 0,
          });
          this.$toast.success('删除成功');
          this.$emit('change');
        })
        .catch(() => {});
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'success':
          return '通过';
        case 'done':
          return '完成';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '暂存';
        default:
          return v || '-无-';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .left {
    .title {
      font-size: 14px;
      padding-right: 70px;
      color: #333333;
    }

    .desc {
      margin-top: 6px;
    }
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
