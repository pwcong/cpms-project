<template>
  <block title="项目跟进信息" class="follow-panel" theme="primary">
    <template v-slot:action>
      <p-button
        v-show="currentIndex === selectedIndex && formCmpts.length > 0"
        @click="handleSaveStage"
        type="primary"
        :loading="loading"
        style="margin-left: 8px"
      >
        保存当前阶段数据
      </p-button>
      <p-button
        v-show="!!nextStage && currentIndex === selectedIndex"
        @click="handleNextStage"
        type="primary"
        :loading="loading"
        style="margin-left: 8px"
      >
        推进到下一阶段
      </p-button>
      <p-button
        @click="handleChangeStage"
        type="primary"
        style="margin-left: 8px"
        :loading="loading"
        v-show="currentIndex !== selectedIndex"
      >
        变更为当前阶段
      </p-button>
    </template>
    <div style="margin-top: 16px">
      <template v-if="(tempValue.projectStageList || []).length > 0">
        <stepper
          :steps="
            (tempValue.projectStageList || []).map((d) => ({
              ...d,
              text: `${d.fdName} ${d.fdCompletePercentage || 0}%`,
              done: d.fdStageStatus === 'fulfill',
            }))
          "
          :currentStep="currentIndex"
          :selectedStep="selectedIndex"
          @select="handleSelectStage"
        />
      </template>

      <div class="follow-empty" v-else>
        <p-empty />
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
      readOnly
      v-show="currentIndex !== selectedIndex"
      :components="selectedCmpts"
      :value="selectedData"
      :rules="selectedRules"
    />
  </block>
</template>

<script>
import { buildSelectionMixin, userMixin } from '@/mixins';
import FollowForm from './follow-form';
import api from '@/api';

import { formatStatus as formatGrantStatus } from '../Grant/GrantList';
import { formatStatus as formatContractStatus } from '../Contract/ContractList';
import { formatStatus as formatPriceStatus } from '../Price/PriceList';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'follow-panel',
  mixins: [selectionMixin, userMixin],
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
              text: `[${formatGrantStatus(d.fdStatus)}] 关于${
                d.fdCustName || '-'
              }的工程项目授权`,
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
              text: `[${formatContractStatus(d.fdStatus)}] 关于${
                d.fdProjectMainName || '-'
              }的合同申请`,
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
              text: `[${formatPriceStatus(d.fdStatus)}] 关于${
                d.fdProjectMainName || '-'
              }的价格申请`,
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
      const remove = this.$message.loading('获取阶段数据中', 0);

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
        // this.$message.success("阶段数据获取成功");
      } catch (e) {
      } finally {
        remove();
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
        this.$message.error('未找到当前阶段和下一阶段信息');
        return;
      }

      this.$refs['form'].$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        this.$confirm({
          title: '是否确认推进到下一阶段?',
          onOk: async () => {
            const formData = this.getStageSubmitForm(
              this.formData,
              this.formCmpts,
              this.currentStage,
              this.nextStage
            );

            await api.business.postProjectChangeStage(formData);

            this.$message.success('推进到下一阶段成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
    handleSaveStage() {
      if (this.loading) {
        return;
      }

      if (!this.currentStage) {
        this.$message.error('未找到当前阶段信息');
        return;
      }

      this.$confirm({
        title: '是否确认保存当前阶段数据?',
        onOk: async () => {
          const formData = this.getStageSubmitForm(
            this.formData,
            this.formCmpts,
            this.currentStage
          );

          await api.business.postProjectStageSave(formData);

          this.$message.success('保存当前阶段数据成功');
        },
        onCancel: () => {},
      });
    },
    handleChangeStage() {
      if (this.loading || this.selectedIndex === this.currentIndex) {
        return;
      }

      const selectedStage = (this.tempValue.projectStageList || [])[this.selectedIndex];
      if (!this.currentStage || !selectedStage) {
        this.$message.error('未找到当前阶段和下一阶段信息');
        return;
      }

      this.$confirm({
        title: '是否确认变更为当前阶段?',
        onOk: async () => {
          await api.business.putProjectChangeStageForm({
            fdId: this.currentStage.id,
            nextId: selectedStage.id,
          });

          this.$message.success('变更为当前阶段成功');
          this.onOk();
        },
        onCancel: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.follow-panel {
}
</style>
