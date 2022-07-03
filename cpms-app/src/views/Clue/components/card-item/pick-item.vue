<template>
  <div class="card-wrapper" @click="handleDetail(tempValue.id, query)">
    <div class="left">
      <div class="title">
        <span>{{ tempValue.fdClueName || '--' }} </span>
      </div>
      <div class="desc">
        <span> 客户名: </span>
        <span>{{ tempValue.fdTerminalClient || '--' }}</span>
      </div>
      <div class="desc">
        <span> 线索描述: </span>
        <span> {{ tempValue.fdClueDescription || '--' }} </span>
      </div>
      <div class="desc" v-if="tempValue.fdClueStatus != 'pass'">
        <span>最近跟进时间: </span>
        <span>{{ formatDateTime(tempValue.updateTime) }}</span>
      </div>
    </div>
    <div class="bottom" style="text-align: right; margin-top: 10px">
      <van-button size="small" type="danger" v-if="checkButton(tempValue, 'follow')" @click.stop="handleFollow()">
        认领
      </van-button>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdClueStatus"> {{ tempValue.fdClueStatus | foramtStatus }}</status-tag>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import formMixin from '../../ClueEdit/form';
import StatusTag from '@/views/components/status-tag';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'clue-pick-item',
  mixins: [selectionMixin, formatMixin, commonMixin, formMixin],
  components: {
    StatusTag,
  },
  props: {
    query: { type: Object },
  },
  data() {
    const { queryType } = this.$route.query;
    return {
      selectedId: '',
      version: 0,
      queryType,
    };
  },

  methods: {
    handleFollow() {
      this.$dialog
        .confirm({
          message: '请确认是否要认领此线索?',
        })
        .then(async () => {
          // on confirm
          await api.clue.putFollowClue([
            {
              id: this.tempValue.id,
              version: this.tempValue.version,
            },
          ]);
          this.$toast.success('线索认领成功');
          this.$emit('change');
        })
        .catch(() => {
          // on cancel
        });
    },
    //跳转客户
    handleCustomers(record) {
      this.$router.push({
        path: '/Customer/InterdCustomerCreate',
        query: {
          source: 'clue',
          targetId: record.id,
        },
      });
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '待处理';
        case 'follow':
          return '跟进中';
        case 'discard':
          return '已作废';
        case 'changing':
          return '转化中';
        case 'changed':
          return '已转化';
        default:
          return v || '--';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.card-wrapper {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .title {
    font-size: 14px;
    color: #333333;
    padding-right: 70px;
  }

  .desc {
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
