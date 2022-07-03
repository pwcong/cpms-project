<template>
  <list-layout class="page-project-follow">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`项目跟进`"
        left-text="返回"
        left-arrow
        right-text="其他操作"
        @click-left="handleCancel"
        @click-right="showOperations = true"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <div class="project-info">
          <div class="left">
            <img :src="svgEmpty" />
          </div>
          <div class="right">
            <div class="title">
              {{ formData.fdName }}
            </div>
            <div class="tags" style="margin-top: 4px">
              <van-button size="mini" plain type="danger">
                {{ formData.fdProjectTypeName }}
              </van-button>
              <van-button size="mini" plain type="danger"> {{ formatAmount(formData.fdProjectSum) }}元 </van-button>
            </div>
          </div>
        </div>

        <follow-panel :value="formData" @change="initData" />
      </div>
    </template>

    <van-action-sheet
      v-model="showOperations"
      :actions="operations"
      close-on-click-action
      @select="handleSelectOperation"
      cancel-text="取消"
    />

    <project-change-manager
      :value="formData"
      :moduleId="id"
      :visible.sync="showProjectChangeManager"
      @change="handleCancel"
    />
  </list-layout>
</template>

<script>
import { userMixin, formatMixin } from '@/mixins';
import formMixin from './form';
import FollowPanel from './follow-panel';
import svgEmpty from '@/assets/images/empty.svg';
import ProjectChangeManager from '../components/project-change-manager';

export default {
  name: 'ProjectFollow',
  mixins: [userMixin, formMixin, formatMixin],
  components: {
    FollowPanel,
    ProjectChangeManager,
  },
  data() {
    const { id } = this.$route.params;
    return {
      inited: false,
      loading: false,
      id,
      svgEmpty,
      showOperations: false,
      showProjectChangeManager: false,
    };
  },
  created() {
    this.initData();
  },
  activated() {
    if (this.inited) {
      this.initData();
    } else {
      this.inited = true;
    }
  },
  computed: {
    operations() {
      const value = [
        {
          key: 'changeManager',
          name: '更换责任人',
        },
        {
          key: 'grant',
          name: '转授权',
        },
        {
          key: 'price',
          name: '转价格',
        },
        {
          key: 'contract',
          name: '转合同',
        },
      ];

      return value;
    },
  },
  methods: {
    async initData() {
      this.formData.projectStageList = [];
      await this.initFormData(this.id);
      await this.initStageData(this.id);
    },
    handleSelectOperation(operation) {
      switch (operation.key) {
        case 'changeManager':
          this.showProjectChangeManager = true;
          break;
        case 'grant':
          this.$router.push({
            path: `/Business/Grant/GrantCreate?source=project&targetId=${this.id}`,
          });
          break;
        case 'price':
          this.$router.push({
            path: `/Business/Price/PriceCreate?source=project&targetId=${this.id}`,
          });
          break;
        case 'contract':
          this.$router.push({
            path: `/Business/Contract/ContractCreate?source=project&targetId=${this.id}`,
          });
          break;
        default:
          break;
      }

      this.showOperations = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.page-project-follow {
  .project-info {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #eeeeee;
    display: flex;

    .left {
      background-color: #f5f5f5;
      margin-right: 14px;
      padding: 8px;
      border-radius: 4px;
      img {
        width: 70px;
        height: 70px;
      }
    }

    .right {
      flex: 1;
    }

    .title {
      font-size: 13px;
    }
  }
}
</style>
