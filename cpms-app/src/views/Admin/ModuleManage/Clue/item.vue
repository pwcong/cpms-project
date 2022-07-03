<template>
  <div class="card-wrapper" @click="handleDetail">
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

    <div class="right">
      <status-tag :status="tempValue.fdClueStatus"> {{ tempValue.fdClueStatus | foramtStatus }}</status-tag>
    </div>

    <van-action-sheet v-model="showAction" cancel-text="取消" close-on-click-action :get-container="getDocumentBody" />
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import StatusTag from '../../../components/status-tag';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'clue-item',
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    StatusTag,
  },
  props: {
    checkActions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedId: '',
      version: 0,
      showAction: false,
    };
  },

  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Clue/ClueDetail/${this.tempValue.id}`,
      });
    },
    handleFollow() {
      this.$dialog
        .confirm({
          message: '请确认是否要认领此线索?',
        })
        .then(async () => {
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
    handleRelease() {
      this.$dialog
        .confirm({
          message: '请确认是否要释放此线索?',
        })
        .then(async () => {
          await api.clue.putReleaseClue([
            {
              id: this.tempValue.id,
              version: this.tempValue.version,
            },
          ]);

          this.$toast.success('线索释放成功');

          this.$emit('change');
        })
        .catch(() => {
          // on cancel
        });
    },
    handleRefresh() {
      this.$emit('change');
    },

    handleEdit() {
      this.$router.push({
        path: `/Clue/ClueEdit/${this.tempValue.id}`,
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
  .btn {
    font-size: 0;
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
