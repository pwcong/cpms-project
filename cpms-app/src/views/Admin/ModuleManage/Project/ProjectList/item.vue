<template>
  <div class="project-item" @click="handleDetail">
    <div class="title">
      {{ tempValue.fdName || '--' }}
    </div>
    <div class="desc">
      <span> 客户/代理商: </span>
      <span>
        {{ tempValue.fdCustName || '--' }}
      </span>
    </div>
    <div class="desc">
      <span>单据编号: </span>
      <span>{{ tempValue.fdNumber }}</span>
    </div>
    <div class="desc">
      <span>项目总金额: </span>
      <span>{{ formatAmount(tempValue.fdProjectSum) }}元</span>
    </div>
    <div class="desc">
      <span>更新时间: </span>
      <span>{{ formatDateTime(tempValue.fdUpdateTime) || '--' }}</span>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdProjectStatus">
        {{ tempValue.fdProjectStatusName }}
      </status-tag>
    </div>

    <project-close :moduleId="selectedId" :visible.sync="showProjectClose" @change="handleRefresh" />
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import ProjectClose from '../../../../Business/components/project-close';
import StatusTag from '@/views/components/status-tag';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'project-item',
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    ProjectClose,
    StatusTag,
  },
  data() {
    return {
      showProjectClose: false,
      selectedId: '',
    };
  },

  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Business/ProjectDetail/${this.tempValue.id}`,
      });
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
    handleEdit() {
      this.$router.push({
        path: `/Business/ProjectEdit/${this.tempValue.id}`,
      });
    },
    handleClose() {
      this.selectedId = this.tempValue.id;
      this.showProjectClose = true;
    },
    handleRefresh() {
      this.$emit('change');
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
