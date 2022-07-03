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
          title="错误修复"
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
                :required="tempValue.fdCustName ? false : true"
                :rules="[
                  {
                    required: tempValue.fdCustName ? false : true,
                    message: '请选择意向客户',
                    trriger: 'change',
                  },
                ]"
                name="cpmsCustId"
                label="意向客户"
                placeholder="请选择"
                is-link
                clickable
                readonly
                v-model="tempValue.cpmsCustName"
                @click="showCpmsCustId = true"
              />

              <van-field
                :required="tempValue.cpmsCustId ? false : true"
                :rules="[
                  {
                    required: tempValue.cpmsCustId ? false : true,
                    message: '请选择客户名称',
                    trriger: 'change',
                  },
                ]"
                is-link
                clickable
                readonly
                v-model="tempValue.fdCustName"
                name="fdCustName"
                label="客户名称"
                placeholder="请选择"
                @click="showTianyancha = true"
              />

              <van-field
                :required="tempValue.cpmsCustId ? false : true"
                :rules="[
                  {
                    required: tempValue.cpmsCustId ? false : true,
                    message: '请选择业务员',
                    trriger: 'change',
                  },
                ]"
                name="fdLoginName"
                label="业务员"
                placeholder="请选择"
                is-link
                clickable
                readonly
                :value="tempValue.fdLoginName"
                @click="showLoginName = true"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <selection-customer
      :value="
        !!tempValue.cpmsCustId
          ? [
              {
                value: tempValue.cpmsCustId,
              },
            ]
          : []
      "
      title="选择意向客户"
      @change="handleChangeCpmsCustId"
      allow-clear
      status="pass"
      :visible.sync="showCpmsCustId"
    >
    </selection-customer>

    <selection-tianyancha
      :visible.sync="showTianyancha"
      title="选择天眼查"
      allow-clear
      searchable
      @change="handleSelectTianyancha"
    />

    <selection-user
      :max="1"
      searchable
      title="选择业务员"
      :value="!!tempValue.fdLoginName ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }] : []"
      @change="handleSelectUser"
      :visible.sync="showLoginName"
    />
  </van-popup>
</template>

<script>
import api from '@/api';
import SelectionCustomer from '../../components/selection/customer-list';
import SelectionTianyancha from '@/views/components/selection/tianyancha';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdLoginName: '',
    fdUserName: '',
    cpmsCustId: '',
    cpmsCustName: '',
  },
});

export default {
  name: 'distribute-salesman',
  mixins: [selectionMixin],
  components: { SelectionTianyancha, SelectionCustomer },
  props: {
    sapCustId: String,
    version: [String, Number],
    cpmsCustId: String,
  },
  data() {
    return {
      showCpmsCustId: false,
      showTianyancha: false,
      showLoginName: false,
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.handleCustSapCustomer();
      }
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    onFormSubmit() {
      this.$dialog
        .confirm({
          title: '请确认是否要错误修复?',
        })
        .then(() => {
          api.customer.postRelationCompany({
            fdLoginName: this.tempValue.fdLoginName,
            fdUserName: this.tempValue.fdUserName,
            cpmsCustId: this.tempValue.cpmsCustId,
            fdCompanyName: this.tempValue.fdCustName,
            fdUnifiedCode: this.tempValue.fdUnifiedCode,
            ids: [this.sapCustId],
          });
          this.$toast.success('错误修复成功');
          this.onOk();
        })
        .catch(() => {});
    },
    async handleCustSapCustomer() {
      if (!this.sapCustId) {
        return;
      }
      const custSapCustomerInfo = await api.customer.getCustSapCustomer(this.sapCustId);
      this.tempValue.fdCustName = custSapCustomerInfo.fdCompanyName;
      this.tempValue.fdUnifiedCode = custSapCustomerInfo.fdCreditCode;
      this.tempValue.fdLoginName = custSapCustomerInfo.fdLoginName;
      this.tempValue.fdUserName = custSapCustomerInfo.fdUserName;
    },

    handleChangeCpmsCustId(res) {
      this.tempValue.cpmsCustId = (res[0] || {}).value;
      this.tempValue.cpmsCustName = (res[0] || {}).text;
    },
    async handleSelectTianyancha(value) {
      try {
        const res = await api.customer.getCustomerTianyanchaInfo((value || [])[0].id);
        this.tempValue = {
          ...this.tempValue,
          fdUnifiedCode: res.data.fdCreditCode,
          fdCustName: res.data.fdName,
        };
      } catch (e) {
      } finally {
      }
    },
    handleSelectUser(value) {
      this.tempValue.fdLoginName = (value[0] || {}).uid;
      this.tempValue.fdUserName = (value[0] || {}).name;
    },
  },
};
</script>
<style lang="scss" scoped></style>
