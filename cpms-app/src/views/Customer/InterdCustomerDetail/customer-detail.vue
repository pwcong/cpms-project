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
          <div v-if="!!tempValue.fdCustName && !!tempValue.fdEnterpriseId">
            <span @click="checkSkyeyeDetails" class="checkSkyeye"> 查看天眼查客户详情 </span>
          </div>
        </template>
        <van-field v-model="tempValue.fdCustName" readonly label="客户名称" name="fdCustName" />
        <van-field v-model="tempValue.fdNumber" name="fdNumber" readonly label="客户编码">
          <template #input>
            <barcode :value="tempValue.fdNumber" />
          </template>
        </van-field>
        <van-field v-model="tempValue.fdUnifiedCode" readonly label="统一信用编码" name="fdUnifiedCode" />
        <van-field :value="tempValue.fdCustType" readonly label="客户类型" name="fdCustType">
          <template #input>
            <dict-text :value="(tempValue.fdCustType || '').split(',')" dictCode="cpms_cust_type" systemCode="cpms" />
          </template>
        </van-field>
        <van-field :value="tempValue.fdCustIndustry" label="所属行业" readonly name="fdCustIndustry">
          <template #input>
            <dict-text
              :value="(tempValue.fdCustIndustry || '').split(',')"
              dictCode="cpms_business"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field v-model="tempValue.fdCompanyType" readonly label="公司类型" name="fdCompanyType" />
        <van-field v-model="tempValue.fdCompanyRegassets" readonly label="注册资金(万)" name="fdCompanyRegassets" />
        <van-field v-model="tempValue.fdCustManageforms" readonly label="经营状态" name="fdCustManageforms" />
        <van-field :value="tempValue.fdPurchaseAmount" readonly label="年度采购额(万)" name="fdPurchaseAmount">
          <template #input>
            <dict-text
              :value="(tempValue.fdPurchaseAmount || '').split(',')"
              dictCode="cpms_cust_purchase_amount"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field :value="tempValue.fdSalesVolumeint" readonly label="年度销量(万)" name="fdSalesVolumeint">
          <template #input>
            <dict-text
              :value="(tempValue.fdSalesVolumeint || '').split(',')"
              dictCode="cpms_cust_sales_volumeint"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field v-model="tempValue.fdTotalCount" readonly label="公司总人数" name="fdTotalCount" />
        <van-field v-model="tempValue.fdCompanyRegtime" readonly label="成立时间" name="fdCompanyRegtime" />
        <van-field v-model="tempValue.fdRegLocation" readonly label="注册地址" name="fdRegLocation" />
        <van-field v-model="tempValue.fdProvince" readonly label="注册省份" name="fdProvince" />
        <van-field v-model="tempValue.fdCity" readonly label="注册城市" name="fdCity" />
        <van-field :value="tempValue.fdCustSource" readonly label="客户来源" name="fdCustSource">
          <template #input>
            <dict-text
              :value="(tempValue.fdCustSource || '').split(',')"
              dictCode="cpms_clue_source"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field :value="tempValue.fdChannel" readonly label="渠道信息" name="fdChannel">
          <template #input>
            <dict-text
              :value="(tempValue.fdChannel || '').split(';')"
              dictCode="cpms_comtomer_channel"
              systemCode="cpms"
            />
          </template>
        </van-field>
        <van-field
          :value="(tempValue.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
          name="sysAttContractAspectParams"
          label="营业执照"
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
        <van-field
          rows="3"
          show-word-limit
          autosize
          readonly
          label="客户情况简介"
          type="textarea"
          v-model="tempValue.fdCustProfile"
          name="fdCustProfile"
        />
        <van-field v-model="tempValue.fdUserName" readonly label="关联业务员" name="fdUserName" />
        <van-field v-model="tempValue.fdAgentName" readonly label="关联代理商" name="fdAgentName" />
        <van-field
          :value="tempValue.sysDatascopePersonAspectParams.map((d) => d.text).join(',')"
          readonly
          label="共享人员"
          name="sysDatascopePersonAspectParams"
        />
        <van-field
          :value="tempValue.sysDatascopeDeptAspectParams.map((d) => d.text).join(',')"
          readonly
          label="共享部门（部门内所有人员可见）"
          name="sysDatascopeDeptAspectParams"
        />
        <van-field :value="tempValue.fdIsAgent === '1' ? '是' : '否'" readonly label="是否代理商" name="fdIsAgent" />
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
