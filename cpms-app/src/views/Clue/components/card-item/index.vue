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
        <span>单据编号: </span>
        <span>{{ tempValue.fdNumber }}</span>
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

    <div class="action" style="margin-top: 10px; text-align: right" v-if="actions.length > 0">
      <van-button size="small" type="danger" @click.stop="showAction = true"> 更多操作 </van-button>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdClueStatus"> {{ tempValue.fdClueStatus | foramtStatus }}</status-tag>
    </div>

    <!-- 分配 -->
    <allot-operation :moduleId="selectedId" :version="version" :visible.sync="allotVisible" @change="handleRefresh" />
    <!-- 作废 -->
    <cancel-operation :moduleId="selectedId" :version="version" :visible.sync="cancelVisible" @change="handleRefresh" />
    <!-- 跟进 -->
    <fdrecord-operation
      :moduleId="selectedId"
      :version="version"
      :visible.sync="followUpVisible"
      @change="handleRefresh"
    />

    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      @select="handleAction"
      cancel-text="取消"
      close-on-click-action
      :get-container="getDocumentBody"
    />
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import formMixin from '../../ClueEdit/form';
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';
import allotOperation from '../operation/allot';
import cancelOperation from '../operation/cancel';
import FdrecordOperation from '../operation/fdrecord.vue';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'clue-item',
  mixins: [selectionMixin, formatMixin, commonMixin, formMixin],
  components: {
    cancelOperation,
    allotOperation,
    FdrecordOperation,
    StatusTag,
  },
  props: {
    checkActions: {
      type: Array,
      default: () => [],
    },
    query: {
      type: Object,
    },
  },
  data() {
    const { queryType } = this.$route.query;
    return {
      selectedId: '',
      version: 0,
      cancelVisible: false,
      allotVisible: false,
      followUpVisible: false,
      showAction: false,
      queryType,
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
          key: 'follow',
          name: '认领',
        },
        {
          key: 'allot',
          name: '分配',
        },
        {
          key: 'visit',
          name: '拜访',
        },
        {
          key: 'discard',
          name: '作废',
        },
        {
          key: 'followUp',
          name: '跟进',
        },
        {
          key: 'release',
          name: '释放',
        },
        {
          key: 'changeCust',
          name: '转客户',
        },
        {
          key: 'changeProject',
          name: '转项目',
        },
        {
          key: 'del',
          name: '删除',
        },
      ].filter((d) => this.checkButton(this.tempValue, d.key));
    },
  },
  methods: {
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
    // 跳转拜访页
    handleVisit() {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
        query: {
          source: 'clue',
          targetId: this.tempValue.id,
        },
      });
    },
    //跳转客户
    handleCustomer() {
      this.$router.push({
        path: '/Customer/InterdCustomerCreate',
        query: {
          source: 'clue',
          targetId: this.tempValue.id,
        },
      });
    },
    //跳转项目
    handleProject() {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query: {
          source: 'clue',
          targetId: this.tempValue.id,
        },
      });
    },

    // handleEdit() {
    //   this.$router.push({
    //     path: `/Clue/ClueEdit/${this.tempValue.id}`,
    //   });
    // },
    handleDelete() {
      this.$dialog
        .confirm({
          title: '请确认是否要删除此线索?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.clue.putClueDelete({
              id: this.tempValue.id,
              fdIsValid: '0',
              version: this.tempValue.version,
            });
            this.$toast.success('删除成功');

            this.handleRefresh();
          } finally {
            this.loading = false;
          }
        });
    },

    handleAction(action) {
      switch (action.key) {
        case 'edit':
          this.handleEdit(this.tempValue.id);
          break;
        case 'follow':
          this.handleFollow();
          break;
        case 'allot':
          this.version = this.tempValue.version;
          this.selectedId = this.tempValue.id;
          this.allotVisible = true;
          break;
        case 'visit':
          this.handleVisit();
          break;
        case 'discard':
          this.version = this.tempValue.version;
          this.selectedId = this.tempValue.id;
          this.cancelVisible = true;
          break;
        case 'followUp':
          this.version = this.tempValue.version;
          this.selectedId = this.tempValue.id;
          this.followUpVisible = true;
          break;
        case 'release':
          this.handleRelease();
          break;
        case 'changeCust':
          this.handleCustomer();
          break;
        case 'changeProject':
          this.handleProject();
          break;
        case 'del':
          this.handleDelete();
          break;
        default:
          break;
      }

      this.showAction = false;
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
