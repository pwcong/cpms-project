<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar
          :class="className"
          title="分配业务员操作"
          left-text="取消"
          left-arrow
          right-text="确定"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                name="fdLoginName"
                label="业务员"
                placeholder="请选择"
                is-link
                clickable
                readonly
                :value="tempValue.fdLoginName"
                @click="showLoginName = true"
              />
              <van-field
                name="personList"
                label="共享人员"
                :value="(tempValue.personList || []).map((d) => d.fdPersonName).join(',')"
                placeholder="请选择"
                is-link
                clickable
                readonly
                @click="showPersonList = true"
              />
              <van-field
                name="sysDataScopeDeptList"
                label="部门"
                placeholder="请选择"
                :value="(tempValue.sysDataScopeDeptList || []).map((d) => d.fdDeptName).join(',')"
                is-link
                clickable
                readonly
                @click="showSysDataScopeDeptList = true"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <selection-user
      :max="1"
      searchable
      title="选择业务员"
      :value="!!tempValue.fdLoginName ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }] : []"
      @change="handleSelectUser"
      :visible.sync="showLoginName"
    />

    <selection-user
      title="选择共享人员"
      searchable
      multiple
      :value="
        (tempValue.personList || [])
          .filter((d) => d.fdPersonId != null || d.fdPersonName != null)
          .map((d) => ({
            uid: d.fdPersonId,
            name: d.fdPersonName,
          }))
      "
      @change="handlePersonList"
      :visible.sync="showPersonList"
    />

    <selection-org
      title="选择部门"
      orgType="1"
      :value="
        (tempValue.sysDataScopeDeptList || []).map((d) => ({
          code: d.fdDeptId || '',
          name: d.fdDeptName || '',
        }))
      "
      @change="handleSysDataScopeDeptList"
      :visible.sync="showSysDataScopeDeptList"
    />
  </van-popup>
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
    version: [String, Number],
    cpmsCustId: String,
  },
  data() {
    return {
      showLoginName: false,
      showPersonList: false,
      showSysDataScopeDeptList: false,
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
      this.tempValue.sysDataScopeDeptList = customerDetailInfo.sysDatascopeDeptAspectParams;
      this.tempValue.fdLoginName = customerDetailInfo.fdLoginName;
      this.tempValue.fdUserName = customerDetailInfo.fdUserName;
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.$dialog
        .confirm({
          title: '请确认是否要分配该业务员?',
        })
        .then(() => {
          api.customer.putDistributeSalesman({
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

          this.$toast.success('业务员分配成功');
          this.onOk();
        })
        .catch(() => {});
    },

    handleSelectUser(value) {
      this.tempValue.fdLoginName = (value[0] || {}).uid;
      this.tempValue.fdUserName = (value[0] || {}).name;
    },
    handlePersonList(res) {
      this.tempValue.personList = res.map((d, index) => ({
        ...d,
        fdPersonId: d.uid,
        fdPersonName: d.name,
        fdModuleFlag: 'cpms_cust_main',
        fdFieldFlag: 'cust',
      }));
    },
    handleSysDataScopeDeptList(res) {
      this.tempValue.sysDataScopeDeptList = res.map((d) => ({
        fdDeptId: d.code,
        fdDeptName: d.name,
        fdModuleFlag: 'cpms_cust_main',
        fdFieldFlag: 'cust',
      }));
    },
  },
};
</script>
<style lang="scss" scoped></style>
