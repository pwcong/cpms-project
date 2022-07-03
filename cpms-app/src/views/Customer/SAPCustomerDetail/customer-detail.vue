<template>
  <div style="top: 46px; height: calc(100% - 90px)">
    <van-form ref="form">
      <block theme="primary" title="基本信息">
        <template v-slot:title>
          <div>
            <span style="color: #666666">基本信息</span>
          </div>
        </template>
        <template v-slot:action>
          <div v-if="!!tempValue.fdSapCustName && !!tempValue.fdEnterpriseId">
            <span @click="checkSkyeyeDetails" class="checkSkyeye"> 查看天眼查客户详情 </span>
          </div>
        </template>
        <van-field v-model="tempValue.fdSapCustName" readonly label="客户名称" name="fdSapCustName" />
        <van-field v-model="tempValue.fdSapNumber" name="fdSapNumber" readonly label="客户编码">
          <template #input>
            <barcode :value="tempValue.fdSapNumber" />
          </template>
        </van-field>
        <van-field v-model="tempValue.fdSapUnifiedCode" readonly label="统一信用编码" name="fdSapUnifiedCode" />
        <van-field v-model="tempValue.fdSapCustName2" readonly label="客户名称2" name="fdSapCustName2" />
        <van-field v-model="tempValue.fdSapShortName" readonly label="客户简称" name="fdSapShortName" />
        <van-field :value="tempValue.fdSapAccountGroup" readonly label="客户账户组" name="fdSapAccountGroup">
          <template #input>
            <dict-text
              :value="(tempValue.fdSapAccountGroup || '').split(',')"
              dictCode="cpms_sap_account_group"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field :value="tempValue.fdSapCountry" readonly label="国家" name="fdSapCountry">
          <template #input>
            <dict-text :value="(tempValue.fdSapCountry || '').split(',')" dictCode="cpms_country" systemCode="cpms" />
          </template>
        </van-field>
        <van-field v-model="tempValue.fdSapProvince" readonly label="省" name="fdSapProvince" />
        <van-field v-model="tempValue.fdSapCity" readonly label="市" name="fdSapCity" />
        <van-field v-model="tempValue.fdSapCounty" readonly label="县" name="fdSapCounty" />
        <van-field v-model="tempValue.fdSapTowns" readonly label="乡镇" name="fdSapTowns" />
        <van-field v-model="tempValue.fdSapAddress" readonly label="详细地址" name="fdSapAddress" />
        <van-field v-model="tempValue.fdSapContact" readonly label="联系人" name="fdSapContact" />
        <van-field v-model="tempValue.fdSapMobile" readonly label="手机号" name="fdSapMobile" />
        <van-field v-model="tempValue.fdSapPhone" readonly label="固话" name="fdSapPhone" />
        <van-field v-model="tempValue.fdSapMail" readonly label="客户邮箱" name="fdSapMail" />
        <van-field :value="tempValue.fdPurchaseAmount" readonly label="CRM门店市场级别" name="fdPurchaseAmount">
          <template #input>
            <dict-text :value="(tempValue.fdShopLevel || '').split(',')" dictCode="cpms_shop_level" systemCode="cpms" />
          </template>
        </van-field>
        <van-field :value="tempValue.fdShopType" readonly label="CRM门店分级" name="fdShopType">
          <template #input>
            <dict-text :value="(tempValue.fdShopType || '').split(',')" dictCode="cpms_shop_type" systemCode="cpms" />
          </template>
        </van-field>
        <van-field :value="tempValue.fdAgent" readonly label="是否代理商" name="fdAgent">
          <template #input>
            <dict-text :value="(tempValue.fdAgent || '').split(',')" dictCode="cpms_agent" systemCode="cpms" />
          </template>
        </van-field>
        <van-field
          :value="(tempValue.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
          name="sysAttContractAspectParams"
          label="附件"
          readonly
        >
          <uploader
            mode="file"
            slot="input"
            multiple
            readonly
            :value="tempValue.sysAttContractAspectParams"
            @input="tempValue.sysAttContractAspectParams = $event"
          />
        </van-field>

        <skyeye-detail
          :fdEnterpriseId="tempValue.fdEnterpriseId"
          :customerId="id"
          :version="tempValue.version"
          :visible.sync="skyeyeVisible"
        />
      </block>
    </van-form>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
import SkyeyeDetail from '../InterdCustomerEdit/skyeye-detail';

export default {
  name: 'customer-detail',
  mixins: [selectionMixin],
  components: {
    SkyeyeDetail,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      skyeyeVisible: false,
    };
  },
  methods: {
    checkSkyeyeDetails() {
      this.skyeyeVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
@import '@/assets/scss/common.scss';

.checkSkyeye {
  font-size: 12px;
  color: $theme-color;
}
</style>
