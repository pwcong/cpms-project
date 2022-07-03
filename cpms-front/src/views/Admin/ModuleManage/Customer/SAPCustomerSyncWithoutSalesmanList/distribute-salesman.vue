<template>
  <p-modal
    :maskClosable="false"
    title="分配业务员操作"
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
      <p-form-model-item label="业务员" prop="fdLoginName">
        <p-select-user
          :max="1"
          :selectData="
            !!tempValue.fdLoginName
              ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }]
              : []
          "
          @confirm="handleSelectUser"
          placeholder="请选择"
        />
      </p-form-model-item>

      <p-form-model-item label="共享人员">
        <p-select-user
          placeholder="请选择"
          :selectData="
            (tempValue.personList || [])
              .filter((d) => d.fdPersonId != null || d.fdPersonName != null)
              .map((d) => ({
                uid: d.fdPersonId,
                name: d.fdPersonName,
              }))
          "
          @confirm="
            tempValue.personList = ($event || []).map((d, index) => ({
              fdPersonId: d.uid,
              fdPersonName: d.name,
              fdModuleFlag: 'cpms_cust_main',
              fdFieldFlag: 'cust',
            }))
          "
        />
      </p-form-model-item>

      <p-form-model-item label="部门">
        <p-select-org
          placeholder="请选择"
          orgType="1"
          :selectData="
            (tempValue.sysDataScopeDeptList || []).map((d) => ({
              code: d.fdDeptId || '',
              name: d.fdDeptName || '',
            }))
          "
          @confirm="
            tempValue.sysDataScopeDeptList = ($event || []).map((d) => ({
              fdDeptId: d.code,
              fdDeptName: d.name,
              fdModuleFlag: 'cpms_cust_main',
              fdFieldFlag: 'cust',
            }))
          "
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    sysDataScopeDeptList: [],
    personList: [],
    fdLoginName: '',
    fdUserName: '',
  },
});

export default {
  name: 'distribute-salesman',
  mixins: [selectionMixin],
  props: {
    sapCustId: String,
    version: Number,
    cpmsCustId: String,
  },
  data() {
    return {
      rules: {
        fdLoginName: [{ required: true, message: '请选择业务员', trigger: 'change' }],
      },
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.handleInit();
      }
    },
  },
  methods: {
    async handleInit() {
      if (!this.cpmsCustId) {
        return;
      }
      const customerDetailInfo = await api.customer.getCustomerDetail(this.cpmsCustId);

      this.tempValue.personList = customerDetailInfo.sysDatascopePersonAspectParams;
      this.tempValue.sysDataScopeDeptList =
        customerDetailInfo.sysDatascopeDeptAspectParams;
      this.tempValue.fdLoginName = customerDetailInfo.fdLoginName;
      this.tempValue.fdUserName = customerDetailInfo.fdUserName;
    },

    handleSelectUser(value) {
      this.tempValue.fdLoginName = (value[0] || {}).uid;
      this.tempValue.fdUserName = (value[0] || {}).name;
    },

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        this.$confirm({
          title: '请确认是否要分配该业务员?',
          onOk: async () => {
            await api.customer.putDistributeSalesman({
              basicParamList: [
                {
                  cpmsCustId: this.cpmsCustId,
                  sapCustId: this.sapCustId,
                  version: Number(this.version),
                },
              ],
              fdLoginName: this.tempValue.fdLoginName,
              fdUserName: this.tempValue.fdUserName,
              flag: false,
              personList: this.tempValue.personList,
              sysDataScopeDeptList: this.tempValue.sysDataScopeDeptList,
            });

            this.$message.success('业务员分配成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
    // onCancel() {
    //   location.reload();
    // },
  },
};
</script>
