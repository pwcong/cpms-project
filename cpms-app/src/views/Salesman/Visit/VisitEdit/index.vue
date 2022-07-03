<template>
  <list-layout class="page-visit-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`拜访计划${isEdit ? '编辑' : '新建'}`"
        left-text="返回"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : undefined"
        left-arrow
        @click-right="onSubmit('draft')"
        @click-left="handleCancel(true)"
      />
    </template>
    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <van-field
              readonly
              required
              clickable
              is-link
              name="formData.fdVisitPlanYear"
              :value="formData.fdVisitPlanYear"
              label="年"
              placeholder="请选择"
              @click="showYear = true"
              :rules="[{ required: true, message: '请选择年' }]"
            />
            <van-field
              readonly
              required
              clickable
              is-link
              name="formData.fdVisitPlanWeek"
              :value="formData.fdVisitPlanWeek"
              label="周"
              placeholder="请选择"
              @click="showWeek = true"
              :rules="[{ required: true, message: '请选择周' }]"
            />

            <van-field
              readonly
              required
              clickable
              is-link
              v-model="formData.fdVisitType"
              name="formData.fdVisitType"
              label="拜访类型"
              placeholder="请选择"
              @click="showVisitType = true"
              :rules="[{ required: true, message: '请选择拜访类型' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdVisitType || '').split(',')"
                  dictCode="cpms_visit_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              v-if="!!formData.fdVisitType"
              readonly
              required
              clickable
              is-link
              v-model="formData.fdModuleType"
              name="formData.fdModuleType"
              :label="`${moduleName}名称`"
              placeholder="请选择"
              @click="handleShowModule"
              :rules="[{ required: true, message: `请选择${moduleName}名称` }]"
            />
            <van-field
              v-if="!!formData.fdVisitType"
              readonly
              required
              clickable
              is-link
              v-model="formData.fdVisitWay"
              name="formData.fdVisitWay"
              label="拜访方式"
              placeholder="请选择"
              @click="showVisitWay = true"
              :rules="[{ required: true, message: `请选择拜访方式` }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdVisitWay || '').split(',')"
                  dictCode="cpms_visit_way"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              v-if="!!formData.fdVisitType && !!formData.fdVisitWay && !!formData.fdModuleType"
              readonly
              required
              clickable
              is-link
              v-model="formData.fdVisitAddress"
              name="formData.fdVisitAddress"
              label="拜访地址"
              placeholder="请选择"
              @click="handleClickAddress"
              :rules="[{ required: true, message: `请选择拜访地址` }]"
            />
          </block>
          <block theme="primary" title="拜访信息" v-if="!!formData.fdVisitType">
            <template v-slot:action>
              <van-button
                native-type="button"
                size="mini"
                type="danger"
                v-if="!!formData.fdModuleType"
                @click="visitorVisible = true"
                style="margin-left: 8px"
                >选择拜访人
              </van-button>
            </template>
            <van-field
              v-model="formData.fdVisitName"
              name="formData.fdVisitName"
              label="拜访人姓名"
              placeholder="请输入"
              required
              :rules="[{ required: true, message: `请输入拜访人姓名` }]"
            />

            <van-field
              v-model="formData.fdVisitMobile"
              name="formData.fdVisitMobile"
              label="拜访人电话"
              placeholder="请输入"
              required
              :rules="[{ required: true, message: `请输入拜访人电话` }]"
            />
            <van-field
              v-model="formData.fdVisitJob"
              name="formData.fdVisitJob"
              label="拜访人职务"
              placeholder="请输入"
            />
            <van-field
              v-model="formData.fdVisitPurpose"
              name="formData.fdVisitPurpose"
              label="拜访目的"
              placeholder="请输入"
              type="textarea"
              required
              :rules="[{ required: true, message: `请输入拜访目的` }]"
            />
          </block>
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <van-button :loading="loading" block type="danger" @click="handleSubmit"> 提交 </van-button>
      </div>
    </template>

    <van-popup v-model="showYear" position="bottom">
      <picker-year show-toolbar title="选择年" @confirm="handleSelectYear" @cancel="showYear = false" />
    </van-popup>
    <van-popup v-model="showWeek" position="bottom">
      <picker-week
        :year="formData.fdVisitPlanYear"
        show-toolbar
        title="选择周"
        @confirm="handleSelectWeek"
        @cancel="showWeek = false"
      />
    </van-popup>

    <selection-dict
      dictCode="cpms_visit_type"
      systemCode="cpms"
      title="选择拜访类型"
      :value="!!formData.fdVisitType ? [{ value: formData.fdVisitType }] : []"
      :visible.sync="showVisitType"
      @change="handleChangeVisitType"
      searchable
    />
    <selection-clue
      queryType="followBy"
      title="选择线索"
      :allowClear="false"
      :value="!!formData.fdModuleTypeId ? [{ value: formData.fdModuleTypeId }] : []"
      :visible.sync="showClue"
      @change="handleChangeModule"
      searchable
    />
    <selection-customer
      status="todo,audit,pass"
      title="选择客户"
      :allowClear="false"
      :visible.sync="showCustomer"
      @change="handleChangeModule"
      :value="!!formData.fdModuleTypeId ? [{ value: formData.fdModuleTypeId }] : []"
      searchable
    />
    <selection-project
      status="todo,audit,follow,done"
      title="选择项目"
      :allowClear="false"
      :visible.sync="showProject"
      @change="handleChangeModule"
      :value="!!formData.fdModuleTypeId ? [{ value: formData.fdModuleTypeId }] : []"
      searchable
    />

    <selection-clock-in-address
      :value="
        !!formData.fdVisitAddressId
          ? [
              {
                value: formData.fdVisitAddressId,
                text: formData.fdVisitAddress,
              },
            ]
          : []
      "
      title="选择地址"
      @change="handleChangeAddress"
      :visible.sync="showClockInAddress"
      searchable
    />

    <selection-dict
      searchable
      dictCode="cpms_visit_way"
      systemCode="cpms"
      title="选择拜访方式"
      :visible.sync="showVisitWay"
      @change="handleChangeVisitWay"
      :value="!!formData.fdVisitWay ? [{ value: formData.fdVisitWay }] : []"
    />

    <selection-base
      searchable
      :actions="addressActions"
      :options="address"
      title="选择拜访地址"
      :visible.sync="showAddress"
      @change="handleChangeAddress"
      :value="!!formData.fdVisitAddressId ? [{ value: formData.fdVisitAddressId }] : []"
    />

    <selection-amap
      title="新增地址"
      searchable
      @relocation="getPosition"
      :visible.sync="showAddAddress"
      @change="handleSelectAddress"
    >
      <template v-slot:item="{ value, checked }">
        <amap-item :position="position" :value="value" :checked="checked" />
      </template>
    </selection-amap>

    <selection-visitor
      :fdVisitType="formData.fdVisitType"
      :fdModuleTypeId="formData.fdModuleTypeId"
      :visible.sync="visitorVisible"
      @change="handleChangeVisitor"
    />
  </list-layout>
</template>

<script>
import api from '@/api';
import formMixin from './form';
import { userMixin, positionMixin } from '@/mixins';

import PickerYear from '@/views/components/picker/year';
import PickerWeek from '@/views/components/picker/week';

import SelectionClue from '@/views/components/selection/clue';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionProject from '@/views/components/selection/project';
import SelectionClockInAddress from '@/views/Salesman/components/selection/clockin-address';
import SelectionVisitor from '@/views/Salesman/components/selection-visitor';

import AMapItem from '@/components/selection-amap/item';

export default {
  mixins: [userMixin, positionMixin, formMixin],
  components: {
    PickerYear,
    PickerWeek,
    SelectionClue,
    SelectionCustomer,
    SelectionProject,
    SelectionClockInAddress,
    SelectionVisitor,
    'amap-item': AMapItem,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showYear: false,
      showWeek: false,
      showVisitType: false,
      showVisitWay: false,
      showClue: false,
      showCustomer: false,
      showProject: false,
      showAddress: false,
      showClockInAddress: false,
      visitorVisible: false,
      address: [],
      showAddAddress: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
    addressActions() {
      return this.formData.fdVisitType === 'cust'
        ? [
            {
              text: '新增地址',
              func: () => {
                this.showAddAddress = true;
              },
            },
          ]
        : [];
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {
    async handleSelectAddress(v) {
      try {
        v = v[0] || {};

        const {
          text = '',
          value = '',
          provinceName = '',
          cityname = '',
          districtName = '',
          districtId = '',
          streetName = '',
        } = v;
        const t = value.split(',').filter((d) => !!d);
        const officeAddresAddParam = {
          fdMainId: this.formData.fdModuleTypeId,
          fdDetailaddress: text,
          fdProvince: typeof provinceName === 'string' ? provinceName : '',
          fdCity: typeof cityname === 'string' ? cityname : '',
          fdLongitude: Number(t[0]),
          fdLatitude: Number(t[1]),
          fdAdcode: districtId,
          fdCounty: typeof districtName === 'string' ? districtName : '',
          fdStreet: typeof streetName === 'string' ? streetName : '',
          createByName: this.user.name,
        };

        const addressData = await api.customer.postAddCustomerOfficeAddres([officeAddresAddParam]);
        this.formData.fdVisitAddress = (addressData[0] || {}).fdDetailaddress;
        this.formData.fdVisitAddressId = (addressData[0] || {}).id;

        this.loadAddress(this.formData.fdModuleTypeId);
        this.showAddress = false;
      } catch (e) {
      } finally {
      }
    },
    handleShowModule() {
      switch (true) {
        case this.formData.fdVisitType === 'clue':
          this.showClue = true;
          break;
        case this.formData.fdVisitType === 'project':
          this.showProject = true;
          break;
        case this.formData.fdVisitType === 'cust':
          this.showCustomer = true;
          break;
        default:
          break;
      }
    },
    handleSelectYear(res) {
      this.formData.fdVisitPlanYear = res.value;
      this.formData.fdVisitPlanWeek = '';
      this.showYear = false;
    },
    handleSelectWeek(res) {
      this.formData.fdVisitPlanWeek = res.value;
      this.showWeek = false;
    },
    handleChangeVisitType(res) {
      this.formData.fdVisitType = (res[0] || {}).value;
      this.formData.fdModuleTypeId = '';
      this.formData.fdModuleType = '';
      this.formData.fdVisitAddress = '';
      this.formData.fdVisitAddressId = '';
      this.formData.fdVisitName = '';
      this.formData.fdVisitMobile = '';
      this.formData.fdVisitJob = '';
      this.formData.fdVisitWay = '';

      if (this.formData.fdVisitWay === 'address') {
        this.formData.fdVisitAddress = '';
        this.formData.fdVisitAddressId = '';
      }
    },
    handleChangeAddress(res) {
      this.formData.fdVisitAddress = (res[0] || {}).text;
      this.formData.fdVisitAddressId = (res[0] || {}).value;
    },
    handleClickAddress() {
      if (this.formData.fdVisitWay === 'address') {
        this.showAddress = true;
      }
      if (this.formData.fdVisitWay === 'customerVisit') {
        this.showClockInAddress = true;
      }
    },
    handleChangeModule(res) {
      const value = res[0];
      this.formData.fdVisitName = '';
      this.formData.fdVisitMobile = '';
      this.formData.fdVisitJob = '';
      this.formData.fdVisitWay = '';
      this.formData.fdModuleType = value.text;
      this.formData.fdModuleTypeId = value.value;
      this.formData.fdVisitAddress = '';
      this.formData.fdVisitAddressId = '';
      this.loadAddress(value.value);
    },
    handleChangeVisitWay(res) {
      this.formData.fdVisitWay = (res[0] || {}).value;
      this.formData.fdVisitAddress = '';
      this.formData.fdVisitAddressId = '';
    },

    handleSubmit() {
      this.$refs.form.submit();
    },
    onSubmit(action) {
      if (action !== 'draft' && (!!this.loading || !this.checkFormData(this.formData))) {
        return;
      }

      this.$dialog
        .confirm({
          title: `是否确认${action === 'draft' ? '暂存' : '提交'}表单?`,
        })
        .then(() => {
          this.submitFormData(this.formData, action);
        });
    },
    handleChangeVisitor(value) {
      this.formData = {
        ...this.formData,
        fdVisitName: value[0].text,
        fdVisitMobile: value[0].phone,
        fdVisitJob: value[0].position,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.page-visit-edit {
}
</style>
