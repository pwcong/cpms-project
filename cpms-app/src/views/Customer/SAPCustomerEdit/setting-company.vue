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
                :readonly="!sapCustName"
                is-link
                clickable
                name="fdCompanySapCode"
                v-model="tempValue.fdCompanySapCode"
                label="公司代码"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择公司代码' }]"
                @click="selectionCompany"
              />

              <van-field
                readonly
                required
                clickable
                is-link
                :value="tempValue.fdAccount"
                name="fdAccount"
                label="统御科目"
                placeholder="请选择"
                @click="showAccount = true"
                :rules="[{ required: true, message: '请选择统御科目' }]"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdAccount || '').split(',')"
                    dictCode="cpms_sap_account"
                    systemCode="cpms"
                  />
                </template>
              </van-field>

              <van-field
                readonly
                clickable
                is-link
                :value="tempValue.fdClearAccount"
                name="fdClearAccount"
                label="自动清账标识"
                placeholder="请选择"
                @click="showClearAccount = true"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdClearAccount || '').split(',')"
                    dictCode="cpms_sap_clear_account"
                    systemCode="cpms"
                  />
                </template>
              </van-field>
            </block>
          </van-form>
        </div>
      </template>

      <selection-corporate-company
        :visible.sync="showCompanyCode"
        :value="
          !!tempValue.fdCompanyCode
            ? [
                {
                  text: tempValue.fdCompanySapCode,
                  value: tempValue.fdCompanyCode,
                },
              ]
            : []
        "
        placeholder="请选择"
        allow-clear
        searchable
        @change="
          (tempValue.fdCompanySapCode = ($event[0] || {}).text), (tempValue.fdCompanyCode = ($event[0] || {}).value)
        "
      />

      <selection-dict
        searchable
        :value="
          !!tempValue.fdAccount
            ? [
                {
                  text: tempValue.fdAccount,
                  value: tempValue.fdAccountCode,
                },
              ]
            : []
        "
        :visible.sync="showAccount"
        dictCode="cpms_sap_account"
        systemCode="cpms"
        title="选择统驭科目"
        placeholder="请选择"
        @change="(tempValue.fdAccount = ($event[0] || {}).text), (tempValue.fdAccountCode = ($event[0] || {}).value)"
      />

      <selection-dict
        searchable
        :value="
          !!tempValue.fdClearAccount
            ? [
                {
                  value: tempValue.fdClearAccount,
                },
              ]
            : []
        "
        :visible.sync="showClearAccount"
        dictCode="cpms_sap_clear_account"
        systemCode="cpms"
        title="选择自动清账标识"
        placeholder="请选择"
        @change="tempValue.fdClearAccount = ($event[0] || {}).value"
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
    fdCompanySapCode: '', //公司代码（sap编码 系统对应法人）
    fdCompanyCode: '', //公司代码
    fdAccount: '', //统驭科目
    fdAccountCode: '', //统驭科目sap
    fdClearAccount: '', //自动清账标识
  },
});

export default {
  name: 'setting-company',
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
      return `${!this.isEdit ? '新增' : '编辑'}公司代码视图`;
    },
  },
  components: {
    SelectionCorporateCompany,
  },
  data() {
    return {
      showCompanyCode: false,
      showAccount: false,
      showClearAccount: false,
    };
  },
  methods: {
    selectionCompany() {
      if (!!this.sapCustName) {
        this.showCompanyCode = true;
      } else {
        this.$toast('请先选择客户，否则不允许选择公司代码。');
      }
    },
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
