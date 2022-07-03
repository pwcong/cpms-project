<template>
  <block title="项目跟进信息" theme="primary" class="follow-panel">
    <template v-if="(tempValue.projectStageList || []).length > 0">
      <div class="follow-steps" ref="steps">
        <div
          :class="{
            'follow-step': true,
            active: currentIndex === index,
            done: step.fdStageStatus === 'fulfill',
            selected: selectedIndex === index,
          }"
          v-for="(step, index) in tempValue.projectStageList || []"
          :key="index"
          @click="handleSelectStage(step, index)"
          :ref="`step_${index}`"
        >
          <div class="follow-step-wrapper">
            <div class="follow-step-dot">
              <van-icon v-if="step.fdStageStatus === 'fulfill'" name="passed" />
              <van-icon v-else-if="index === currentIndex" name="clock-o" />
              <!-- <span v-else>
                {{ step.fdSortNum }}
              </span> -->
            </div>
            <div class="follow-step-text">
              <span>
                {{ step.fdName }}
              </span>
              <span> {{ step.fdCompletePercentage || 0 }}% </span>
            </div>
          </div>
        </div>
      </div>

      <follow-form
        ref="form"
        v-show="currentIndex === selectedIndex"
        :components="formCmpts"
        v-model="formData"
        :rules="formRules"
      />

      <follow-form
        readonly
        v-show="currentIndex !== selectedIndex"
        :components="selectedCmpts"
        :value="selectedData"
        :rules="selectedRules"
      />

      <div class="follow-btns">
        <van-button
          v-if="currentIndex === selectedIndex && formCmpts.length > 0"
          @click="handleSaveStage"
          type="danger"
          :loading="loading"
          size="small"
        >
          保存当前阶段数据
        </van-button>
        <van-button
          v-if="!!nextStage && currentIndex === selectedIndex"
          @click="handleNextStage"
          type="danger"
          :loading="loading"
          size="small"
        >
          推进到下一阶段
        </van-button>
        <van-button
          @click="handleChangeStage"
          type="danger"
          :loading="loading"
          v-if="currentIndex !== selectedIndex"
          size="small"
        >
          变更为当前阶段
        </van-button>
      </div>
    </template>
    <van-empty v-else image-size="100px" description="暂无数据" />
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { formatStatus as formatGrantStatus } from '../Grant/GrantList';
import { formatStatus as formatContractStatus } from '../Contract/ContractList';
import { formatStatus as formatPriceStatus } from '../Price/PriceList';

import FollowForm from './follow-form';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    projectStageList: [],
  },
});

export default {
  name: 'follow-panel',
  mixins: [selectionMixin, formatMixin],
  components: {
    FollowForm,
  },
  data() {
    return {
      loading: false,
      currentIndex: -1,
      selectedIndex: -1,
      formCmpts: [],
      formRules: {},
      formData: {},
      currentStage: null,
      nextStage: null,
      selectedCmpts: [],
      selectedRules: {},
      selectedData: {},
    };
  },
  watch: {
    tempValue: {
      immediate: true,
      handler(v) {
        const { projectStageList = [] } = v;

        this.currentIndex = projectStageList.findIndex((d) => d.fdCurrentStatus === '1');
        this.selectedIndex = this.currentIndex;
        this.currentStage = projectStageList[this.currentIndex];
        this.nextStage = projectStageList[this.currentIndex + 1];

        this.getStageForm(this.currentStage).then((res) => {
          this.formRules = res.rules || {};
          this.formCmpts = res.components || [];
          this.formData = res.formData || {};
        });
      },
    },
    currentIndex(v) {
      this.$nextTick(() => {
        const steps = this.$refs.steps;
        const step = this.$refs[`step_${v}`];
        if (!steps || !step || !step[0]) {
          return;
        }

        steps.scrollTo({
          left: step[0].offsetLeft - 8,
          behavior: 'smooth',
        });
      });
    },
  },

  methods: {
    async getStageForm(stage) {
      if (!stage) {
        return {};
      }

      const { fdMainId, componentListDtoList, id: stageId } = stage;

      const formCmpts = (componentListDtoList || []).filter((d) => d.fdIsValid === '1');
      const formRules = formCmpts.reduce((p, c) => {
        const t = {
          required: c.fdIsRequired === '1',
          message: `请完善${c.fdComponentName}`,
          trigger: 'blur',
        };

        if (['textDisplay'].indexOf(c.fdComponentType) > -1) {
          t.required = false;
        }

        if (['att'].indexOf(c.fdComponentType) > -1) {
          t.trigger = 'change';
        }

        p[c.id] = [t];

        return p;
      }, {});

      const formData = {};
      for (let i = 0, l = formCmpts.length; i < l; i++) {
        const p = formCmpts[i];
        formData[p.id] = p.fdValue || undefined;

        if (p.fdComponentType === 'att') {
          const fileList = await api.common
            .getFileList({
              attKey: p.fdAttKey,
              moudleId: stageId,
            })
            .then((res) => res.data || []);
          formData[p.id] = fileList.map((d) => ({
            text: d.fdFileName,
            value: d.id,
            path: d.fdPath,
          }));
        }

        if (p.fdComponentType === 'process') {
          // 授权：关于《被授权代理商名称》的工程项目授权
          // 价格：关于《项目名称》的价格申请
          // 合同：关于《项目名称》的合同申请

          if (p.fdProcessId === 'authorizationApplication') {
            const data = await api.grant
              .getProjectGrantList({
                pageNo: 1,
                limit: 200,
                fdProjectMainId: fdMainId,
              })
              .then((res) => res.data || []);

            formData[p.id] = data.map((d) => ({
              text: `[${formatGrantStatus(d.fdStatus)}] 关于${d.fdCustName || '-'}的工程项目授权`,
              value: d.id,
            }));
          } else if (p.fdProcessId === 'ContractContract') {
            const data = await api.contract
              .getContractList({
                pageNo: 1,
                limit: 200,
                fdProjectMainId: fdMainId,
              })
              .then((res) => res.data || []);

            formData[p.id] = data.map((d) => ({
              text: `[${formatContractStatus(d.fdStatus)}] 关于${d.fdProjectMainName || '-'}的合同申请`,
              value: d.id,
            }));
          } else if (p.fdProcessId === 'priceApplication') {
            const data = await api.price
              .getPriceList({
                pageNo: 1,
                limit: 200,
                fdProjectMainId: fdMainId,
              })
              .then((res) => res.data || []);

            formData[p.id] = data.map((d) => ({
              text: `[${formatPriceStatus(d.fdStatus)}] 关于${d.fdProjectMainName || '-'}的价格申请`,
              value: d.id,
            }));
          } else {
            formData[p.id] = [];
          }
        }
      }

      return {
        rules: formRules,
        components: formCmpts,
        formData,
      };
    },

    async handleSelectStage(record, index) {
      const loading = this.$toast.loading({
        message: '获取阶段数据中',
        duration: 0,
        forbidClick: true,
      });

      try {
        if (index !== this.currentIndex) {
          const selectedStage = (this.tempValue.projectStageList || [])[index];
          const data = await api.business.getComponentInfoList({
            nextId: selectedStage.id,
          });
          const res = await this.getStageForm(data);
          this.selectedRules = res.rules || {};
          this.selectedCmpts = res.components || [];
          this.selectedData = res.formData || {};
        }
        this.selectedIndex = index;
      } catch (e) {
        console.error(e);
      } finally {
        loading.clear();
      }
    },

    getStageSubmitForm(formData, formCmpts, currentStage, nextStage) {
      const submitForm = {
        fdId: currentStage.id,
        sysAttContractAspectParams: [],
        projectComponentListEditParamList: [],
        version: currentStage.version,
      };

      if (nextStage) {
        submitForm.fdStageStatus = 'fulfill';
        submitForm.nextId = nextStage.id;
      }

      formCmpts.forEach((c) => {
        const t = {
          id: c.id,
          fdValue: formData[c.id],
        };
        if (c.fdComponentType === 'att') {
          submitForm.sysAttContractAspectParams.push(
            ...t.fdValue.map((d) => ({
              fdAttFileId: d.value,
              fdAttKey: c.fdAttKey,
            }))
          );
          t.fdValue = t.fdValue.map((d) => d.value).join(',');
        }
        if (c.fdComponentType === 'process') {
          t.fdValue = '';
        }

        submitForm.projectComponentListEditParamList.push(t);
      });

      return submitForm;
    },

    handleNextStage() {
      if (this.loading) {
        return;
      }

      if (!this.currentStage || !this.nextStage) {
        this.$toast.fail({
          message: '未找到当前阶段和下一阶段信息',
        });
        return;
      }

      this.$refs['form'].$refs['form'].validate().then((res) => {
        this.$dialog
          .confirm({
            title: '是否确认推进到下一阶段?',
          })
          .then(async () => {
            this.$toast.loading({
              message: '提交数据中',
            });

            try {
              const formData = this.getStageSubmitForm(
                this.formData,
                this.formCmpts,
                this.currentStage,
                this.nextStage
              );

              await api.business.postProjectChangeStage(formData);

              this.$toast.success({
                message: '推进到下一阶段成功',
              });
              this.onOk();
            } catch (e) {
              console.error(e);
            }
          });
      });
    },
    handleSaveStage() {
      if (this.loading) {
        return;
      }

      if (!this.currentStage) {
        this.$toast.fail({
          message: '未找到当前阶段信息',
        });
        return;
      }

      this.$dialog
        .confirm({
          title: '是否确认保存当前阶段数据?',
        })
        .then(async () => {
          this.$toast.loading({
            message: '提交数据中',
          });

          try {
            const formData = this.getStageSubmitForm(this.formData, this.formCmpts, this.currentStage);

            await api.business.postProjectStageSave(formData);
            this.$toast.success({
              message: '保存当前阶段数据成功',
            });
          } catch (e) {
            console.error(e);
          }
        });
    },
    handleChangeStage() {
      if (this.loading || this.selectedIndex === this.currentIndex) {
        return;
      }

      const selectedStage = (this.tempValue.projectStageList || [])[this.selectedIndex];
      if (!this.currentStage || !selectedStage) {
        this.$toast.fail({
          message: '未找到当前阶段和下一阶段信息',
        });
        return;
      }

      this.$dialog
        .confirm({
          title: '是否确认变更为当前阶段?',
        })
        .then(async () => {
          this.$toast.loading({
            message: '提交数据中',
          });

          try {
            await api.business.putProjectChangeStageForm({
              fdId: this.currentStage.id,
              nextId: selectedStage.id,
            });

            this.$toast.success({
              message: '变更为当前阶段成功',
            });
            this.onOk();
          } catch (e) {
            console.error(e);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.follow-panel {
  .follow {
    &-steps {
      padding: 14px 8px;
      font-size: 0;
      overflow: auto;
      white-space: nowrap;
    }

    &-step {
      line-height: 30px;
      vertical-align: middle;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      cursor: pointer;
      display: inline-block;
      font-size: 12px;
      margin: 4px 0;
      margin-right: 12px;
      padding: 0 8px;
      transition: all 0.3s;
      background-color: #dddddd;
      color: #666666;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 0;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 6px solid #dddddd;
        transition: all 0.3s;
      }

      &-wrapper {
        height: 30px;
        display: flex;
        align-items: center;
      }

      &-dot {
        display: flex;
        align-items: center;
      }

      &-text {
        padding: 4px 6px;
      }

      &.done {
        .follow-step-dot {
          color: $theme-color;
        }
        &::after {
          border-left-color: rgba($theme-color, 0.1);
        }
        background-color: rgba($theme-color, 0.1);
      }

      &.active {
        color: white;
        .follow-step-dot {
          color: white;
        }
        background-color: rgba($theme-color, 0.5);
        &::after {
          border-left-color: rgba($theme-color, 0.5);
        }
      }
      &.selected {
        color: white;
        .follow-step-dot {
          color: white;
        }
        background-color: rgba($theme-color, 0.9);
        &::after {
          border-left-color: rgba($theme-color, 0.9);
        }
      }
    }

    &-btns {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>
