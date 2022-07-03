<template>
  <list-layout class="page-clue-detail">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="线索详情"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
        :right-text="checkButton(formData, 'edit') ? '编辑' : undefined"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form">
          <block theme="primary" title="基本信息">
            <van-field v-model="formData.fdClueName" label="线索名称" readonly />
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field v-model="formData.fdClueDescription" readonly type="textarea" label="线索描述" />
            <van-field v-model="formData.fdTerminalClient" label="终端客户名称" readonly />
            <van-field :value="formData.fdClueSource" label="线索来源" readonly>
              <template #input>
                <dict-text
                  :value="(formData.fdClueSource || '').split(',')"
                  dictCode="cpms_clue_source"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdClueContactName" label="线索联系人" readonly />
            <van-field v-model="formData.fdClueContactMobile" label="联系方式" readonly />
            <van-field :value="formData.fdProvinceCode" label="省" readonly>
              <template #input>
                <province-text :value="(formData.fdProvinceCode || '').split(',')" />
              </template>
            </van-field>
            <van-field :value="formData.fdCityCode" label="市" readonly>
              <template #input>
                <city-text :provinceCode="formData.fdProvinceCode" :value="(formData.fdCityCode || '').split(',')" />
              </template>
            </van-field>
            <van-field
              :value="formData.productLineList.map((d) => d.fdProductLineName).join(',')"
              autosize
              label="产品线"
              readonly
            />
            <van-field :value="formData.fdClueType" label="线索类型" readonly>
              <template #input>
                <dict-text
                  :value="(formData.fdClueType || '').split(',')"
                  dictCode="cpms_clue_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field :value="formData.fdAgencyName" label="所属机构" readonly />

            <van-field v-model="formData.fdCustName" label="代理商名称" readonly />
            <van-field v-model="formData.fdUserName" label="跟进人" readonly />
            <van-field
              label="可见范围-部门"
              :value="formData.sysDatascopeDeptAspectParams.map((d) => d.fdDeptName).join(',')"
              readonly
            />
            <van-field v-model="formData.fdBiddingNumber" label="招标编号" readonly />
            <van-field
              label="可见范围-人员"
              :value="formData.sysDatascopePersonAspectParams.map((d) => d.fdPersonName).join(',')"
              readonly
            />
            <van-field v-model="formData.fdOtherRemark" label="备注" readonly type="textarea" />
          </block>
          <block theme="primary" title="客户详情">
            <van-field :value="formData.fdCustIndustry" label="所属行业" readonly>
              <template #input>
                <dict-text
                  :value="(formData.fdCustIndustry || '').split(',')"
                  dictCode="cpms_business"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdCompanyType" label="公司类型" readonly />
            <van-field v-model="formData.fdCustContactPhone" label="电话" readonly />
            <van-field v-model="formData.fdCustContactMobile" label="手机" readonly />
            <van-field v-model="formData.fdCompanyWeb" label="网址" readonly />
            <van-field :value="formData.fdCompanyRegtime" label="成立时间" name="datetimePicker" readonly />
            <van-field v-model="formData.fdTotalCount" label="公司总人数" type="digit" readonly />
            <van-field v-model="formData.fdSalesVolumeint" label="年度销量" type="number" readonly />
            <van-field v-model="formData.fdPurchaseAmount" label="年度采购额" type="number" readonly />
            <van-field v-model="formData.fdBrand" label="旗下品牌" readonly />
            <van-field v-model="formData.fdKeyDept" label="关键部门" readonly />
            <van-field v-model="formData.fdRegCapital" label="注册资本" type="number" readonly />
            <van-field v-model="formData.fdRegStatus" label="企业状态" readonly />
            <van-field v-model="formData.fdUserCommunity" label="用户群体" readonly type="textarea" />
          </block>

          <more-info readonly :value="formData" />

          <block>
            <van-tabs>
              <van-tab theme="primary" title="其他联系人">
                <contact-list readonly v-model="formData" />
              </van-tab>
              <van-tab theme="primary" title="办公地址">
                <address-list readonly v-model="formData" />
              </van-tab>
              <van-tab theme="primary" title="跟进记录">
                <follow-record readonly :moduleId="id" moduleFlag="cpms_clue_main" />
              </van-tab>
              <van-tab theme="primary" title="操作记录">
                <modify-record readonly :moduleId="id" moduleFlag="cpms_clue_main" />
              </van-tab>
            </van-tabs>
          </block>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { userMixin, formatMixin } from '@/mixins';
import formMixin from '../ClueEdit/form';
import FollowRecord from '../../components/follow-record';
import ContactList from '../ClueEdit/contact-list';
import AddressList from '../ClueEdit/address-list';
import ModifyRecord from '../../components/modify-record';
import MoreInfo from '@/views/components/more-info';
import { ProvinceText } from '@/views/components/selection/province';
import { CityText } from '@/views/components/selection/city';
import { commonMixin } from '@/views/mixins';

export default {
  name: 'ClueDetail',
  mixins: [userMixin, formMixin, formatMixin, commonMixin],
  components: {
    FollowRecord,
    ContactList,
    AddressList,
    ModifyRecord,
    MoreInfo,
    ProvinceText,
    CityText,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      inited: false,
    };
  },

  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
