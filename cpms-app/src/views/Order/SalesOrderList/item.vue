<template>
  <div class="project-item" @click="handleDetail(tempValue.id)">
    <div class="title">
      {{ tempValue.fdCpmsCustName || '--' }}
    </div>
    <div class="desc">
      <span> 项目名称: </span>
      <span>
        {{ tempValue.fdProjectName || '--' }}
      </span>
    </div>
    <div class="desc">
      <span>单据编号: </span>
      <span>{{ tempValue.fdCustOrderNo }}</span>
    </div>
    <div class="desc">
      <span>创建人: </span>
      <span>{{ tempValue.createByName }}</span>
    </div>
    <div class="desc">
      <span>创建时间: </span>
      <span>{{ formatDateTime(tempValue.createTime) || '--' }}</span>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | foramtStatus }}
      </status-tag>
    </div>

    <div class="action" style="margin-top: 10px; text-align: right" v-if="actions.length > 0">
      <van-button size="small" type="danger" @click.stop="showAction = true"> 更多操作 </van-button>
    </div>

    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      @select="handleAction"
      cancel-text="取消"
      close-on-click-action
      :get-container="getDocumentBody"
    />
    <!-- <project-close :moduleId="selectedId" :visible.sync="showProjectClose" @change="handleRefresh" /> -->
  </div>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';
// import formMixin from '../ProjectEdit/form';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'sales-order-item',
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    // ProjectClose,
    StatusTag,
  },
  data() {
    return {
      showProjectClose: false,
      selectedId: '',
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
          key: 'followUp',
          name: '跟进',
        },
        {
          key: 'visit',
          name: '拜访',
        },
        {
          key: 'close',
          name: '关闭',
        },
        {
          key: 'delete',
          name: '删除',
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
    handleDetail(id) {
      console.log('123');
      // this.$router.push({
      //   path: `/Order/SalesOrderDetail/${id}`,
      // });
    },
    handleVisit() {
      this.$router.push({
        path: `/Salesman/Visit/VisitCreate`,
        query: {
          source: 'project',
          targetId: this.tempValue.id,
        },
      });
    },
    handleFollow() {
      this.$router.push({
        path: `/Business/ProjectFollow/${this.tempValue.id}`,
        query: {
          projectTypeId: this.tempValue.fdProjectTypeId,
          projectTypeName: this.tempValue.fdProjectTypeName,
        },
      });
    },
    handleClose() {
      this.selectedId = this.tempValue.id;
      this.showProjectClose = true;
    },
    handleRefresh() {
      this.$emit('change');
    },
    handleDelete() {
      this.$dialog
        .confirm({
          title: '请确认是否要删除此项目?',
        })
        .then(async () => {
          this.loading = true;

          try {
            await api.business.postCloseProject({
              id: this.tempValue.id,
              fdIsValid: '0',
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
        case 'followUp':
          this.handleFollow();
          break;
        case 'visit':
          this.handleVisit();
          break;
        case 'close':
          this.handleClose();
          break;
        case 'delete':
          this.handleDelete();
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

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .title {
    font-size: 14px;
    color: #333333;
    padding-right: 80px;
  }

  .desc {
    margin-top: 6px;
    // margin-right: 80px;
  }

  .right {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .bottom {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
