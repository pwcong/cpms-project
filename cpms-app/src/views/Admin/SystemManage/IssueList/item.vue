<template>
  <div class="project-item" @click="handleDetail(tempValue)">
    <div class="left">
      <div class="desc">
        <span class="descone">问题描述: </span>
        <span class="descSpan">{{ tempValue.fdDesc || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">提问者姓名: </span>
        <span class="descSpan">{{ tempValue.fdUserName || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">提问者手机号: </span>
        <span class="descSpan">{{ tempValue.fdMobile || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">提问者邮箱: </span>
        <span class="descSpan">{{ tempValue.fdEmail || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">提问时间: </span>
        <span class="descSpan">{{ formatDateTime(tempValue.fdDate) || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">处理人姓名: </span>
        <span class="descSpan">{{ tempValue.fdHandleUserName || '--' }}</span>
      </div>
      <div class="desc">
        <span class="descone">是否常见问题: </span>
        <span class="descSpan">{{ tempValue.fdIsCommon === '1' ? '是' : '否' || '--' }}</span>
      </div>
    </div>

    <div class="action" style="margin-top: 10px; text-align: right" v-if="actions.length > 0">
      <van-button size="small" type="danger" @click.stop="showAction = true"> 更多操作 </van-button>
    </div>

    <div class="right">
      <status-tag :status="tempValue.fdStatus"> {{ tempValue.fdStatusName }}</status-tag>
    </div>
    <!-- 关闭 -->
    <question-close :moduleId="selectedId" :version="version" :visible.sync="closeVisible" @change="handleRefresh" />
    <!-- 已解决 -->
    <question-solved :moduleId="selectedId" :version="version" :visible.sync="solvedVisible" @change="handleRefresh" />

    <!-- <setting-issue :moduleId="selectedId" :mode="settingMode" :visible.sync="settingVisible" /> -->

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
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';
// import SettingIssue from './setting-issue';
import QuestionClose from '../components/question-close';
import QuestionSolved from '../components/question-solved';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'issue-list-item',
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    StatusTag,
    // SettingIssue,
    QuestionClose,
    QuestionSolved,
  },
  props: {
    checkActions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // settingVisible: false,
      version: 0,
      selectedId: '',
      showAction: false,
      closeVisible: false,
      solvedVisible: false,
    };
  },
  computed: {
    actions() {
      return [
        {
          key: 'accept',
          name: '接受',
        },
        {
          key: 'close',
          name: '关闭',
        },
        {
          key: 'solved',
          name: '已解决',
        },
        {
          key: 'setCommon',
          name: '置为常见问题',
        },
        {
          key: 'cacleCommon',
          name: '取消常见问题',
        },
      ].filter(
        (d) => this.checkButton(this.tempValue, d.key) && this.checkActions.findIndex((_d) => _d === d.key) > -1
      );
    },
  },

  methods: {
    handleDetail() {
      this.selectedId = this.tempValue.id;
    },
    handleRefresh() {
      this.$emit('change');
    },
    handleAccept() {
      this.$dialog
        .confirm({
          message: '是否确认接受问题?',
        })
        .then(async () => {
          await api.common.putQuestionForm({
            id: this.tempValue.id,
            fdStatus: 'handle',
            fdHandleUserName: this.tempValue.fdHandleUserName,
            fdHandleLoginName: this.tempValue.fdHandleLoginName,
          });

          this.$toast.success('问题接受成功');

          this.$emit('change');
        })
        .catch(() => {
          // on cancel
        });
    },
    handleSetCommon(record, fdIsCommon) {
      this.$dialog
        .confirm({
          message: `是否确认${fdIsCommon === '1' ? '置为' : '取消'}常见问题?`,
        })
        .then(async () => {
          await api.common.putQuestionForm({
            id: record.id,
            fdIsCommon: fdIsCommon,
          });

          this.$toast.success('请求成功');

          this.$emit('change');
        })
        .catch(() => {
          // on cancel
        });
    },
    handleAction(action) {
      switch (action.key) {
        case 'accept':
          this.handleAccept();
          break;
        case 'close':
          this.version = this.tempValue.version;
          this.selectedId = this.tempValue.id;
          this.closeVisible = true;
          break;
        case 'solved':
          this.version = this.tempValue.version;
          this.selectedId = this.tempValue.id;
          this.solvedVisible = true;
          break;
        case 'setCommon':
          this.handleSetCommon(this.tempValue, '1');
          break;
        case 'cacleCommon':
          this.handleSetCommon(this.tempValue, '0');
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
