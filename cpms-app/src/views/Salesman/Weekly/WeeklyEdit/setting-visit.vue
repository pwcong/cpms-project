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
          title="拜访计划设置"
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
                required
                clickable
                is-link
                v-model="tempValue.fdVisitType"
                name="tempValue.fdVisitType"
                label="拜访类型"
                placeholder="请选择"
                @click="showVisitType = true"
                :rules="[{ required: true, message: '请选择拜访类型' }]"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdVisitType || '').split(',')"
                    dictCode="cpms_visit_type"
                    systemCode="cpms"
                  />
                </template>
              </van-field>
              <van-field
                v-if="!!tempValue.fdVisitType"
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdModuleType"
                name="tempValue.fdModuleType"
                :label="`${moduleName}名称`"
                placeholder="请选择"
                @click="handleShowModule"
                :rules="[{ required: true, message: `请选择${moduleName}名称` }]"
              />
              <van-field
                v-if="!!tempValue.fdVisitType"
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdVisitWay"
                name="tempValue.fdVisitWay"
                label="拜访方式"
                placeholder="请选择"
                @click="showVisitWay = true"
                :rules="[{ required: true, message: `请选择拜访方式` }]"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdVisitWay || '').split(',')"
                    dictCode="cpms_visit_way"
                    systemCode="cpms"
                  />
                </template>
              </van-field>
              <van-field
                v-if="!!tempValue.fdVisitType && !!tempValue.fdVisitWay"
                readonly
                required
                clickable
                is-link
                v-model="tempValue.fdVisitAddress"
                name="tempValue.fdVisitAddress"
                label="拜访地址"
                placeholder="请选择"
                @click="handleClickAddress"
                :rules="[{ required: true, message: `请选择拜访地址` }]"
              />
              <van-field
                v-model="tempValue.fdVisitName"
                name="tempValue.fdVisitName"
                label="拜访人姓名"
                placeholder="请输入"
                :maxlength="100"
                required
                :rules="[{ required: true, message: `请输入拜访人姓名` }]"
              />
              <van-field
                v-model="tempValue.fdVisitJob"
                name="tempValue.fdVisitJob"
                label="拜访人职务"
                placeholder="请输入"
              />
              <van-field
                v-model="tempValue.fdVisitMobile"
                name="tempValue.fdVisitMobile"
                label="拜访人电话"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入拜访人电话` }]"
              />
              <van-field
                v-model="tempValue.fdVisitPurpose"
                name="tempValue.fdVisitPurpose"
                label="拜访目的"
                placeholder="请输入"
                required
                :rules="[{ required: true, message: `请输入拜访目的` }]"
              />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>

    <selection-dict
      searchable
      dictCode="cpms_visit_type"
      systemCode="cpms"
      title="选择拜访类型"
      :visible.sync="showVisitType"
      @change="handleChangeVisitType"
      :value="!!tempValue.fdVisitType ? [{ value: tempValue.fdVisitType }] : []"
    />
    <selection-clue
      queryType="followBy"
      title="选择线索"
      :visible.sync="showClue"
      @change="handleChangeModule"
      :value="!!tempValue.fdModuleTypeId ? [{ value: tempValue.fdModuleTypeId }] : []"
      searchable
    />
    <selection-customer
      status="todo,audit,pass"
      title="选择客户"
      :visible.sync="showCustomer"
      :value="!!tempValue.fdModuleTypeId ? [{ value: tempValue.fdModuleTypeId }] : []"
      @change="handleChangeModule"
      searchable
    />
    <selection-project
      status="todo,audit,follow,done"
      title="选择项目"
      :visible.sync="showProject"
      @change="handleChangeModule"
      searchable
      :value="!!tempValue.fdModuleTypeId ? [{ value: tempValue.fdModuleTypeId }] : []"
    />

    <selection-dict
      searchable
      dictCode="cpms_visit_way"
      systemCode="cpms"
      title="选择拜访方式"
      :visible.sync="showVisitWay"
      @change="tempValue.fdVisitWay = ($event[0] || {}).value"
      :value="!!tempValue.fdVisitWay ? [{ value: tempValue.fdVisitWay }] : []"
    />

    <selection-base
      searchable
      :options="address"
      title="选择拜访地址"
      :visible.sync="showAddress"
      :value="!!tempValue.fdVisitAddressId ? [{ value: tempValue.fdVisitAddressId }] : []"
      @change="handleChangeAddress"
    />

    <selection-clock-in-address
      searchable
      :value="
        !!tempValue.fdVisitAddressId
          ? [
              {
                value: tempValue.fdVisitAddressId,
                text: tempValue.fdVisitAddress,
              },
            ]
          : []
      "
      title="选择地址"
      @change="handleChangeAddress"
      :visible.sync="showClockInAddress"
    />
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

import SelectionClue from '@/views/components/selection/clue';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionProject from '@/views/components/selection/project';
import SelectionClockInAddress from '@/views/Salesman/components/selection/clockin-address';

import api from '@/api';

export function getModuleName(visitType) {
  switch (true) {
    case visitType === 'clue':
      return '线索';
    case visitType === 'cust':
      return '客户';
    case visitType === 'project':
      return '项目';
    default:
      return '模块';
  }
}

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdVisitType: '',
    fdModuleTypeId: '',
    fdModuleType: '',
    fdVisitWay: 'address',
    fdVisitAddress: '',
    fdVisitAddressId: '',
    fdVisitName: '',
    fdVisitJob: '',
    fdVisitMobile: '',
    fdVisitPurpose: '',
  },
});

export default {
  name: 'setting-visit',
  mixins: [selectionMixin],
  components: {
    SelectionClue,
    SelectionCustomer,
    SelectionProject,
    SelectionClockInAddress,
  },
  data() {
    return {
      showVisitType: false,
      showVisitWay: false,
      showClue: false,
      showCustomer: false,
      showProject: false,
      showAddress: false,
      showClockInAddress: false,
      address: [],
    };
  },
  computed: {
    moduleName() {
      return getModuleName(this.tempValue.fdVisitType);
    },
  },
  methods: {
    handleShowModule() {
      switch (true) {
        case this.tempValue.fdVisitType === 'clue':
          this.showClue = true;
          break;
        case this.tempValue.fdVisitType === 'project':
          this.showProject = true;
          break;
        case this.tempValue.fdVisitType === 'cust':
          this.showCustomer = true;
          break;
        default:
          break;
      }
    },
    handleChangeVisitType(res) {
      this.tempValue.fdVisitType = (res[0] || {}).value;
      this.tempValue.fdModuleTypeId = '';
      this.tempValue.fdModuleType = '';
      if (this.tempValue.fdVisitWay === 'address') {
        this.tempValue.fdVisitAddress = '';
        this.tempValue.fdVisitAddressId = '';
      }
    },
    handleChangeAddress(res) {
      this.tempValue.fdVisitAddress = (res[0] || {}).text;
      this.tempValue.fdVisitAddressId = (res[0] || {}).value;
    },
    handleClickAddress() {
      if (this.tempValue.fdVisitWay === 'address') {
        this.showAddress = true;
      }
      if (this.tempValue.fdVisitWay === 'customerVisit') {
        this.showClockInAddress = true;
      }
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    handleChangeModule(res) {
      const value = res[0];
      this.tempValue.fdModuleType = value.text;
      this.tempValue.fdModuleTypeId = value.value;
      this.tempValue.fdVisitAddress = '';
      this.tempValue.fdVisitAddressId = '';
      this.loadAddress(value.value);
    },
    async loadAddress(id) {
      const { fdVisitType } = this.tempValue;

      if (fdVisitType === 'clue') {
        const data = await api.clue.getClueDetail(id);
        console.log(data);
        this.address = (data.addressList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'project') {
        const data = await api.business.getProjectDetail(id);
        console.log(data);
        this.address = (data.addressListDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailAddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'cust') {
        const data = await api.customer.getCustomerDetail(id);
        console.log(data);
        this.address = (data.addressDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      }
    },
    onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
