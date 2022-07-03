<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-form-model-item label="费用承担方" prop="fdCostBearName">
        <select-dict
          :value="
            !!tempValue.fdCostBearName
              ? [
                  {
                    value: tempValue.fdCostBearCode,
                    text: tempValue.fdCostBearName,
                  },
                ]
              : []
          "
          @change="handleChangeFdCostBearName"
          placeholder="请选择"
          allow-clear
          systemCode="cpms"
          dictCode="cpms_cost_bear"
        />
      </p-form-model-item>
      <p-form-model-item label="金额(元)" prop="fdAmount">
        <p-input-number
          style="width: 100%"
          placeholder="请输入"
          v-model="tempValue.fdAmount"
        />
      </p-form-model-item>
      <p-form-model-item label="是否TCL安装" prop="fdIsTclInstall">
        <select-yes-or-no
          :value="!!tempValue.fdIsTclInstall ? [{ value: tempValue.fdIsTclInstall }] : []"
          placeholder="请选择"
          @change="tempValue.fdIsTclInstall = $event[0].value"
        />
      </p-form-model-item>

      <p-form-model-item label="安装说明" prop="fdInstallExplain">
        <p-textarea
          :maxLength="500"
          :autoSize="{
            minRows: 4,
          }"
          placeholder="请输入"
          v-model="tempValue.fdInstallExplain"
        />
      </p-form-model-item>
      <p-form-model-item label="客户需求表" prop="sysAttContractAspectParams">
        <uploader v-model="tempValue.sysAttContractAspectParams" multiple />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
// import SelectCostBear from "@/views/Business/Price/components/select/cost-bear";
import SelectYesOrNo from '@/views/components/select/yes-or-no';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdAmount: 0,
    fdCostBearCode: '',
    fdInstallExplain: '',
    fdIsTclInstall: 0,
    sysAttInstallAspectParams: [],
    fdAttKey: 'INSTALL_FILE',
  },
});

export default {
  name: 'setting-install',
  mixins: [selectionMixin],
  props: {
    moduleId: String,
  },
  components: {
    // SelectCostBear,
    SelectYesOrNo,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}安装费`;
    },
  },
  data() {
    return {
      fdAttKey: 'INSTALL_FILE',
      rules: {
        fdCostBearName: [
          {
            required: true,
            message: '请选择费用承担方',
            trigger: 'change',
          },
        ],
        fdAmount: [
          {
            required: true,
            message: '请输入金额(元)',
            trigger: 'blur',
          },
        ],
        fdIsTclInstall: [
          {
            required: true,
            message: '请选择是否TCL安装',
            trigger: 'change',
          },
        ],

        fdFloor: [
          {
            required: true,
            message: '请输入楼层',
            trigger: 'blur',
          },
        ],
        fdInstallExplain: [
          {
            required: true,
            message: '请输入安装说明',
            trigger: 'blur',
          },
        ],
        sysAttContractAspectParams: [
          {
            required: true,
            message: '请输入客户需求表',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    handleChangeFdCostBearName(value) {
      this.tempValue.fdCostBearCode = (value[0] || {}).value;
      this.tempValue.fdCostBearName = (value[0] || {}).text;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.tempValue = {
          ...this.tempValue,
          sysAttInstallAspectParams: this.tempValue.sysAttInstallAspectParams.map(
            (d) => ({
              fdAttKey: this.fdAttKey,
              fdAttFileId: d.value,
              fdFileName: d.text,
            })
          ),
        };
        this.onOk();
      });
    },
  },
};
</script>
