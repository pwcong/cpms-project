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
          title="公司代码视图设置"
          left-text="取消"
          left-arrow
          right-text="保存"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                readonly
                clickable
                is-link
                :value="tempValue.fdBankCountry"
                name="fdBankCountry"
                label="银行国家/地区"
                placeholder="请选择"
                @click="showCountry = true"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdBankCountry || '').split(',')"
                    dictCode="cpms_country"
                    systemCode="cpms"
                  />
                </template>
              </van-field>

              <van-field v-model="tempValue.fdBankAccount" name="fdBankAccount" label="银行账号" placeholder="请输入" />

              <van-field
                v-model="tempValue.fdBankAccName"
                name="fdBankAccName"
                label="开户行详细名称"
                placeholder="请输入"
              />

              <van-field
                readonly
                clickable
                is-link
                :value="tempValue.fdIsVat"
                name="fdIsVat"
                label="是否为专用发票"
                placeholder="请选择"
                @click="showIsVat = true"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdIsVat || '').split(',')"
                    dictCode="cpms_sap_is_vat"
                    systemCode="cpms"
                  />
                </template>
              </van-field>
            </block>
          </van-form>
        </div>
      </template>

      <selection-dict
        searchable
        :value="
          !!tempValue.fdBankCountry
            ? [
                {
                  text: tempValue.fdBankCountry,
                  value: tempValue.fdBankCountryCode,
                },
              ]
            : []
        "
        :visible.sync="showCountry"
        dictCode="cpms_country"
        systemCode="cpms"
        title="选择银行国家/地区"
        placeholder="请选择"
        @change="
          (tempValue.fdBankCountry = ($event[0] || {}).text), (tempValue.fdBankCountryCode = ($event[0] || {}).value)
        "
      />

      <selection-dict
        searchable
        :value="
          !!tempValue.fdIsVat
            ? [
                {
                  value: tempValue.fdIsVat,
                },
              ]
            : []
        "
        :visible.sync="showIsVat"
        dictCode="cpms_sap_is_vat"
        systemCode="cpms"
        title="是否为专用发票"
        placeholder="请选择"
        @change="tempValue.fdIsVat = ($event[0] || {}).value"
      />
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectionCorporateCompany from '@/views/components/selection/sap-company';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdBankCountryCode: '', //银行国家/地区code
    fdBankCountry: '', //银行国家/地区
    fdBankAccount: '', //银行账号
    fdBankAccName: '', //开户行详细名称
    fdIsVat: '', //是否为专用发票
  },
});

export default {
  name: 'setting-bank',
  mixins: [selectionMixin],
  props: {
    sapCustName: {
      type: String,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}银行账户信息`;
    },
  },
  components: {
    SelectionCorporateCompany,
  },
  data() {
    return {
      showCompanyCode: false,
      showCountry: false,
      showIsVat: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
