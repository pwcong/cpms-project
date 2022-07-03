<template>
  <list-layout class="page-customer-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}客户`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <div class="warm-prompt">
          <span style="color: #ff0000">温馨提示</span>: 客户归类越详细，越方便后期查找和统计
        </div>
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <template v-slot:title>
              <div>
                <span style="color: #333333">基本信息</span>
              </div>
            </template>
            <template v-slot:action>
              <div v-if="!!formData.fdCustName && !!formData.fdEnterpriseId">
                <span @click="checkSkyeyeDetails" class="checkSkyeye"> 查看天眼查客户详情 </span>
              </div>
            </template>
            <van-field
              required
              is-link
              clickable
              readonly
              v-model="formData.fdCustName"
              name="fdCustName"
              label="客户名称"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入客户名称' }]"
              @click="selectionCustName"
            />
            <van-field
              v-model="formData.fdUnifiedCode"
              name="fdUnifiedCode"
              label="统一信用编码"
              placeholder="请输入"
              readonly
            />
            <van-field
              readonly
              required
              clickable
              is-link
              :value="formData.fdCustType"
              name="fdCustType"
              label="客户类型"
              placeholder="请选择"
              @click="showCustomerType = true"
              :rules="[{ required: true, message: '请选择客户类型' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdCustType || '').split(',')"
                  dictCode="cpms_cust_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              :value="formData.fdCustIndustry"
              clickable
              is-link
              readonly
              label="所属行业"
              placeholder="请选择"
              @click="showIndustry = true"
              required
              name="fdCustIndustry"
              :rules="[{ required: true, message: '请选择所属行业' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdCustIndustry || '').split(',')"
                  dictCode="cpms_business"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdCompanyType" readonly label="公司类型" name="fdCompanyType" />
            <van-field
              v-model="formData.fdCompanyRegassets"
              name="fdCompanyRegassets"
              label="注册资金(万)"
              placeholder="请输入"
              readonly
            />
            <van-field
              readonly
              name="fdCustManageforms"
              v-model="formData.fdCustManageforms"
              label="经营状态"
              placeholder="请选择"
            />
            <van-field
              :value="formData.fdPurchaseAmount"
              readonly
              label="年度采购额(万)"
              name="fdPurchaseAmount"
              clickable
              is-link
              placeholder="请选择"
              @click="showPurchaseAmount = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdPurchaseAmount || '').split(',')"
                  dictCode="cpms_cust_purchase_amount"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              :value="formData.fdSalesVolumeint"
              readonly
              clickable
              is-link
              label="年度销量(万)"
              name="fdSalesVolumeint"
              @click="showSalesVolumeint = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdSalesVolumeint || '').split(',')"
                  dictCode="cpms_cust_sales_volumeint"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              readonly
              v-model="formData.fdTotalCount"
              name="fdTotalCount"
              label="公司总人数"
              placeholder="请输入"
            />
            <van-field
              readonly
              name="fdCompanyRegtime"
              v-model="formData.fdCompanyRegtime"
              label="成立时间"
              placeholder="请输入"
            />
            <van-field v-model="formData.fdRegLocation" readonly label="注册地址" name="fdRegLocation" />
            <template v-if="formData.fdIsDiscern === '0'">
              <van-field
                :rules="[{ required: true, message: '请选择注册省份' }]"
                :value="formData.fdProvinceCode"
                clickable
                is-link
                label="注册省份"
                placeholder="请选择省"
                readonly
                required
                @click="showProvince = true"
              >
                <template #input>
                  <province-text :value="(formData.fdProvinceCode || '').split(',')" />
                </template>
              </van-field>
              <van-field
                :rules="[{ required: true, message: '请选择市' }]"
                :value="formData.fdCityCode"
                clickable
                is-link
                label="注册城市"
                placeholder="请选择市"
                readonly
                required
                @click="onBeforeSelectCity"
              >
                <template #input>
                  <city-text :provinceCode="formData.fdProvinceCode" :value="(formData.fdCityCode || '').split(',')" />
                </template>
              </van-field>
            </template>
            <template v-else>
              <van-field v-model="formData.fdProvince" readonly label="注册省份" name="fdProvince" />
              <van-field v-model="formData.fdCity" readonly label="注册城市" name="fdCity" />
            </template>
            <van-field
              readonly
              clickable
              is-link
              :value="formData.fdCustSource"
              label="客户来源"
              name="fdCustSource"
              @click="showSource = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdCustSource || '').split(',')"
                  dictCode="cpms_clue_source"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              readonly
              clickable
              is-link
              autosize
              rows="1"
              type="textarea"
              label="渠道信息"
              name="fdChannel"
              required
              :value="formData.fdChannel"
              :rules="[{ required: true, message: '请选择渠道信息' }]"
              @click="showChannel = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdChannel || '').split(';')"
                  dictCode="cpms_comtomer_channel"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              :value="(formData.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
              name="sysAttContractAspectParams"
              label="营业执照"
              readonly
            >
              <uploader
                mode="file"
                slot="input"
                multiple
                :value="formData.sysAttContractAspectParams"
                @input="formData.sysAttContractAspectParams = $event"
              />
            </van-field>
            <van-field
              required
              rows="3"
              :maxlength="500"
              show-word-limit
              autosize
              v-model="formData.fdCustProfile"
              name="fdCustProfile"
              label="客户情况简介"
              type="textarea"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入客户情况简介' }]"
            />

            <van-field
              is-link
              label="关联业务员"
              placeholder="请选择"
              :value="formData.fdUserName"
              name="fdUserName"
              clickable
              readonly
              @click="showUser = true"
            />

            <van-field
              readonly
              is-link
              clickable
              name="fdAgentName"
              v-model="formData.fdAgentName"
              label="关联代理商"
              placeholder="请选择"
              @click="showAffiliatedAgents = true"
            />

            <van-field
              rows="2"
              is-link
              clickable
              readonly
              autosize
              type="textarea"
              label="共享人员"
              placeholder="请选择"
              :value="formData.sysDatascopePersonAspectParams.map((d) => d.text).join(',')"
              @click="showShareUser = true"
            />

            <van-field
              rows="2"
              is-link
              clickable
              readonly
              autosize
              type="textarea"
              label="共享部门（部门内所有人员可见）"
              placeholder="请选择"
              :value="formData.sysDatascopeDeptAspectParams.map((d) => d.text).join(',')"
              @click="handleShowDepartment"
            />

            <van-field readonly name="fdIsAgent" :value="formData.fdIsAgent === '1' ? '是' : '否'" label="是否代理商" />
          </block>
          <skyeye-detail
            :fdEnterpriseId="formData.fdEnterpriseId"
            :customerId="id"
            :version="formData.version"
            :visible.sync="skyeyeVisible"
          />
          <contact-list
            :moduleId="id"
            :status="formData.fdStatus"
            :contactList="formData.contactAddParamList"
            v-model="formData"
            @change="handContact"
          />
          <address-list :moduleId="id" :status="formData.fdStatus" v-model="formData" @change="handAddressList" />
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :moduleId="id"
          moduleFlag="cpms_cust_main"
          :beforeSubmit="handleBeforeSubmit"
          :status="formData.fdStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger">
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </van-button>
        </oasubmit-wrapper>
      </div>
    </template>

    <selection-tianyancha
      :visible.sync="showTianyancha"
      placeholder="请选择"
      allow-clear
      searchable
      @change="handleChangeTianyancha"
      :getOption="checkTianyancha"
    />

    <selection-dict
      searchable
      :value="!!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []"
      :visible.sync="showCustomerType"
      dictCode="cpms_cust_type"
      systemCode="cpms"
      title="选择客户类型"
      placeholder="请选择"
      @change="handleChangeCustType"
    />

    <selection-dict
      searchable
      :value="!!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []"
      :visible.sync="showIndustry"
      dictCode="cpms_business"
      systemCode="cpms"
      title="选择所属行业"
      placeholder="请选择"
      @change="formData.fdCustIndustry = ($event[0] || {}).value"
    />

    <selection-dict
      searchable
      :value="!!formData.fdPurchaseAmount ? [{ value: formData.fdPurchaseAmount }] : []"
      :visible.sync="showPurchaseAmount"
      dictCode="cpms_cust_purchase_amount"
      systemCode="cpms"
      title="选择年度采购额"
      placeholder="请选择"
      @change="formData.fdPurchaseAmount = ($event[0] || {}).value"
    />

    <selection-dict
      searchable
      :value="!!formData.fdSalesVolumeint ? [{ value: formData.fdSalesVolumeint }] : []"
      :visible.sync="showSalesVolumeint"
      dictCode="cpms_cust_sales_volumeint"
      systemCode="cpms"
      title="选择年度销量"
      placeholder="请选择"
      @change="formData.fdSalesVolumeint = ($event[0] || {}).value"
    />

    <selection-province
      searchable
      :visible.sync="showProvince"
      :value="!!formData.fdProvinceCode ? [{ value: formData.fdProvinceCode }] : []"
      title="选择注册省份"
      placeholder="请选择"
      @change="handleSelectProvince"
    />

    <selection-city
      searchable
      :provinceCode="formData.fdProvinceCode"
      :value="!!formData.fdCityCode ? [{ value: formData.fdCityCode }] : []"
      :visible.sync="showCity"
      title="选择注册城市"
      placeholder="请选择"
      @change="handleSelectCity"
    />

    <selection-dict
      searchable
      :value="
        !!formData.fdCustSource
          ? [
              {
                text: formData.fdCustSourceName,
                value: formData.fdCustSource,
              },
            ]
          : []
      "
      :visible.sync="showSource"
      dictCode="cpms_clue_source"
      systemCode="cpms"
      title="选择客户来源"
      placeholder="请选择"
      @change="handleSelectSource"
    />

    <selection-dict
      searchable
      multiple
      dictCode="cpms_comtomer_channel"
      systemCode="cpms"
      title="选择渠道信息"
      placeholder="请选择"
      @change="formData.fdChannel = $event.map((d) => d.value).join(';')"
      :visible.sync="showChannel"
    />

    <selection-user
      searchable
      :visible.sync="showUser"
      :value="
        !!formData.fdLoginName
          ? [
              {
                uid: formData.fdLoginName,
                name: formData.fdUserName,
              },
            ]
          : []
      "
      title="关联人员"
      placeholder="请选择"
      @change="handleSelectRelationUser"
    />

    <selection-affiliated-agents
      :visible.sync="showAffiliatedAgents"
      :id="id ? id : ''"
      moduleFlag="cpms_cust_main"
      :filterFlag="1"
      :value="
        !!formData.fdAgentId
          ? [
              {
                value: formData.fdAgentId,
                text: formData.fdAgentName,
              },
            ]
          : []
      "
      placeholder="请选择"
      allow-clear
      searchable
      @change="
        ((formData.fdAgentId = ($event[0] || {}).value) || true) && (formData.fdAgentName = ($event[0] || {}).text)
      "
    />

    <selection-user
      searchable
      multiple
      :visible.sync="showShareUser"
      :value="
        formData.sysDatascopePersonAspectParams.map((d) => ({
          text: d.text,
          value: d.value,
        }))
      "
      title="共享人员"
      @change="formData.sysDatascopePersonAspectParams = $event"
    />

    <selection-org
      searchable
      multiple
      :visible.sync="showDepartment"
      :value="
        formData.sysDatascopeDeptAspectParams.map((d) => ({
          text: d.text,
          value: d.value,
        }))
      "
      title="共享部门"
      @change="formData.sysDatascopeDeptAspectParams = $event"
    />
  </list-layout>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import formMixin from './form';
import { userMixin } from '@/mixins';
import SelectionTianyancha from '@/views/components/selection/tianyancha';
import SelectionProvince from '@/views/components/selection/province';
import { ProvinceText } from '@/views/components/selection/province';
import SelectionCity from '@/views/components/selection/city';
import { CityText } from '@/views/components/selection/city';
import SkyeyeDetail from './skyeye-detail';
import ContactList from './contact-list';
import AddressList from './address-list';
import SelectionAffiliatedAgents from '../components/selection/affiliated-agents';

export default {
  mixins: [userMixin, formMixin],
  components: {
    SelectionTianyancha,
    SkyeyeDetail,
    SelectionProvince,
    ProvinceText,
    SelectionCity,
    CityText,
    ContactList,
    AddressList,
    SelectionAffiliatedAgents,
  },
  data() {
    const { id } = this.$route.params;
    const { source, targetId, type } = this.$route.query;
    return {
      id,
      type,
      source,
      targetId,
      showTianyancha: false,
      customerIdentification: 'cust',
      showCustomerType: false,
      showIndustry: false,
      showPurchaseAmount: false,
      showSalesVolumeint: false,
      showProvince: false,
      showCity: false,
      showSource: false,
      showChannel: false,
      showUser: false,
      showShareUser: false,
      showDepartment: false,
      showAffiliatedAgents: false,
      skyeyeVisible: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {
    selectionCustName() {
      if (!this.isEdit || this.formData.fdStatus === 'draft') {
        this.showTianyancha = true;
      }
    },
    async checkTianyancha(_, item) {
      try {
        await api.customer.getCheckingRepeat(item.creditCode);
        return item;
      } catch (e) {
        throw e;
      }
    },
    async handleChangeTianyancha(res) {
      if (!!res.length > 0) {
        try {
          const tianyanchaInfo = await api.customer.getCustomerTianyanchaInfo((res[0] || {}).id);
          this.formData = {
            ...this.formData,
            fdCustName: tianyanchaInfo.data.fdName,
            fdUnifiedCode: tianyanchaInfo.data.fdCreditCode,
            fdEnterpriseId: tianyanchaInfo.data.fdEnterpriseId,
            fdCompanyType: tianyanchaInfo.data.fdCompanyOrgType,
            fdCompanyRegassets: tianyanchaInfo.data.fdRegCapital,
            fdCustManageforms: tianyanchaInfo.data.fdRegStatus,
            fdTotalCount: tianyanchaInfo.data.fdStaffNumRange,
            fdCompanyRegtime: tianyanchaInfo.data.fdEstiblishTime
              ? dayjs(new Date(tianyanchaInfo.data.fdEstiblishTime)).format('YYYY-MM-DD')
              : tianyanchaInfo.data.fdEstiblishTime,
            fdRegLocation: tianyanchaInfo.data.fdRegLocation,
          };

          const result = await api.customer.postAddressTranslation({
            cityName: tianyanchaInfo.data.fdCity,
          });

          if (result.cityName === null) {
            this.formData = {
              ...this.formData,
              fdIsDiscern: '0', //是否识别注册地址
              fdProvince: '',
              fdCity: '',
            };
          } else {
            this.formData = {
              ...this.formData,
              fdIsDiscern: '1',
              fdProvince: result.provinceName,
              fdCity: result.cityName,
            };
          }
        } catch (e) {
        } finally {
        }
      }
    },
    handleChangeCustType(res) {
      this.formData.fdCustType = (res[0] || {}).value;

      if (this.formData.fdCustType === 'agent') {
        this.formData.fdIsAgent = '1';
      } else {
        this.formData.fdIsAgent = '0';
      }
    },
    handleSelectProvince(res) {
      this.formData.fdProvinceCode = (res[0] || {}).value;
      this.formData.fdProvinceName = (res[0] || {}).text;
      this.formData.fdCityCode = '';
      this.formData.fdCityName = '';
    },
    handleShowDepartment() {
      this.$dialog
        .alert({
          message:
            '温馨提示：选择共享部门后，则部门内全部人员对此客户可使用，请您搜索具体部门名称进行选择。不要勾选TCL实业，防止误操作。',
        })
        .then(() => {
          this.showDepartment = true;
        });
    },
    onBeforeSelectCity() {
      if (!this.formData.fdProvinceCode) {
        this.$toast.fail('请先选择省');
        return;
      }
      this.showCity = true;
    },
    handleSelectCity(res) {
      this.formData.fdCityCode = (res[0] || {}).value;
      this.formData.fdCityName = (res[0] || {}).text;
    },
    handleSelectSource(res) {
      this.formData.fdCustSource = (res[0] || {}).value;
      this.formData.fdCustSourceName = (res[0] || {}).text;
    },
    handleSelectRelationUser(res) {
      this.formData.fdUserName = (res[0] || {}).name;
      this.formData.fdLoginName = (res[0] || {}).uid;
      this.formData.sysDatascopePersonAspectParams = res.map((d) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
      }));
    },
    // 共享人员
    // handleSelectUser(res) {
    //   this.formData.sysDatascopePersonAspectParams = res.map((d) => ({
    //     ...d,
    //     fdPersonId: d.value,
    //     fdPersonName: d.text,
    //   }));
    // },
    handleBeforeSubmit() {
      if (this.loading) {
        return false;
      }

      return new Promise((resolve) => {
        this.$refs.form
          .validate()
          .then(() => {
            if (!this.checkFormData(this.formData)) {
              resolve(false);
              return;
            }
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    },
    handleSubmit(form) {
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$refs.form.submit();
    },
    checkSkyeyeDetails() {
      this.skyeyeVisible = true;
    },
    onSubmit(action) {
      if (this.loading) {
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
.page-customer-edit {
  .warm-prompt {
    font-size: 12px;
    text-align: center;
    background: #ffcc99;
    padding: 5px;
  }
  .checkSkyeye {
    font-size: 12px;
    color: $theme-color;
  }
}
</style>
