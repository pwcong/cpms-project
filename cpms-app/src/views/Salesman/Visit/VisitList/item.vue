<template>
  <div class="project-item" @click="handleDetail(tempValue.id)">
    <div class="title">
      {{ tempValue.fdModuleType || '-' }}
    </div>
    <div class="desc">
      <span>单据编号:</span>
      {{ tempValue.fdNumber || '-' }}
    </div>
    <div class="desc">
      {{ tempValue.fdVisitName || '-' }}
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | foramtStatus }}
      </status-tag>
    </div>
    <div class="bottom">
      <van-button size="mini" plain type="default">{{ tempValue.fdVisitType | formatType }}</van-button>
      <van-button size="mini" plain type="default">打卡{{ tempValue.fdClockCount }}次</van-button>
      <van-button size="mini" plain type="default">反馈{{ tempValue.fdFeedbackCount }}次</van-button>
    </div>
    <div class="action">
      <van-button size="small" type="danger" @click.stop="handleEdit(tempValue.id)" v-if="checkAllowEdit(tempValue)">
        编辑
      </van-button>

      <van-button
        v-if="tempValue.fdFeedbackCount > 0 && checkAllowFeedback(tempValue)"
        size="small"
        type="danger"
        @click.stop="handleFeedback(true)"
      >
        编辑拜访反馈
      </van-button>
      <!-- <van-button size="small" type="danger" v-if="tempValue.fdStatus === 'draft'" @click.stop="handleDel(tempValue.id)"
        >删除
      </van-button> -->
      <van-button v-else-if="checkAllowFeedback(tempValue)" size="small" type="danger" @click.stop="handleFeedback()">
        新建拜访反馈
      </van-button>

      <van-button
        v-if="checkAllowFeedback(tempValue, 'clockin')"
        size="small"
        type="danger"
        @click.stop="handleClockIn"
      >
        打卡
      </van-button>

      <van-button size="small" type="info" @click.stop="call" icon="phone-o" />
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';
import dayjs from 'dayjs';
import StatusTag from '@/views/components/status-tag';
import formMixin from '../VisitEdit/form';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'visit-item',
  mixins: [formMixin, selectionMixin],
  components: {
    StatusTag,
  },
  methods: {
    // 删除逻辑
    handleDel(id) {
      this.$dialog
        .confirm({
          title: '是否确认删除?',
        })
        .then(() => {
          api.salesman.delVisitMain(id);
          this.$toast.success('删除成功');
          this.$emit('change');
        })
        .catch(() => {});
    },
    checkAllowEdit(record) {
      if (record.fdClockCount > 0 || record.fdFeedbackCount > 0 || dayjs().valueOf() > record.fdVisitPlanEndTime) {
        return false;
      }

      return true;
    },

    handleClockIn() {
      this.$router.push({
        path: `/Salesman/Visit/ClockIn`,
        query: {
          id: this.tempValue.id,
        },
      });
    },
    checkAllowFeedback(record, action) {
      if (record.fdStatus === 'draft' || dayjs().valueOf() < record.fdVisitPlanBeginTime) {
        return false;
      }

      if (action === 'clockin' && dayjs().valueOf() > record.fdVisitPlanEndTime) {
        return false;
      }

      return true;
    },
    handleFeedback(isEdit) {
      if (isEdit) {
        this.$router.push({
          path: `/Salesman/Visit/VisitFeedbackEdit/${this.tempValue.visitId}`,
        });
      } else {
        this.$router.push({
          path: '/Salesman/Visit/VisitFeedbackCreate',
          query: {
            visitId: this.tempValue.id,
          },
        });
      }
    },
    call() {
      this.$nativeApi.financeCall(this.tempValue.fdVisitMobile);
    },
  },
  filters: {
    formatType(v) {
      switch (v) {
        case 'cust':
          return '客户拜访';
        case 'project':
          return '项目拜访';
        case 'clue':
          return '线索拜访';
        default:
          return '未知';
      }
    },
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '有效';
        default:
          return v;
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
  position: relative;
  .title {
    font-size: 14px;
    color: #333333;
    padding-right: 80px;
  }

  .desc {
    margin-top: 6px;
    color: #666666;
    padding-right: 80px;
  }

  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .bottom {
    margin-top: 10px;
    font-size: 0;
  }

  .action {
    text-align: right;
    margin-top: 10px;
  }
}
</style>
