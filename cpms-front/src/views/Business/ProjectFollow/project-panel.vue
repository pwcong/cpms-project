<template>
  <block>
    <block title="项目信息" theme="primary">
      <template #action>
        <barcode :value="tempValue.fdNumber" />
      </template>

      <p-row style="margin-top: 16px" :gutter="24">
        <p-col :span="8">
          <p-form-model-item label="项目名称" prop="fdName">
            <p-input v-model="tempValue.fdName" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="项目类型" prop="fdProjectTypeId">
            <select-project-type
              read-only
              :type="1"
              :value="
                !!tempValue.fdProjectTypeId
                  ? [
                      {
                        value: tempValue.fdProjectTypeId,
                        text: tempValue.fdProjectTypeName,
                      },
                    ]
                  : []
              "
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="项目招投标编号" prop="fdTenderNum">
            <p-input v-model="tempValue.fdTenderNum" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="所属行业" prop="fdBusinessCode">
            <select-dict
              read-only
              systemCode="cpms"
              dictCode="cpms_business"
              :value="
                !!tempValue.fdBusinessCode
                  ? [
                      {
                        value: tempValue.fdBusinessCode,
                      },
                    ]
                  : []
              "
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="分公司" prop="fdCorporateCode">
            <select-corporate
              read-only
              :value="
                !!tempValue.fdCorporateCode
                  ? [
                      {
                        value: tempValue.fdCorporateCode,
                        text: tempValue.fdCorporateName,
                      },
                    ]
                  : []
              "
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="业务单元" prop="fdAgencyCode">
            <p-input :value="tempValue.fdAgencyName" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="预计成交率" prop="fdSuccessRate">
            <select-rate
              read-only
              :value="
                !!tempValue.fdSuccessRate
                  ? [
                      {
                        value: tempValue.fdSuccessRate,
                        text: tempValue.fdSuccessRate,
                      },
                    ]
                  : []
              "
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="项目有效截止日期" prop="fdEndTime">
            <p-input v-model="tempValue.fdEndTime" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="预计成交总金额(元)" prop="fdProjectSum">
            <p-input
              style="width: 100%"
              :value="formatAmount(tempValue.fdProjectSum)"
              read-only
            />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="用途" prop="fdUse" readOnly>
            <p-input
              v-model="tempValue.fdUse"
              read-only
              :autoSize="{
                minRows: 4,
              }"
            />
          </p-form-model-item>
        </p-col>

        <p-col :span="24">
          <p-form-model-item
            label="商务中心工程接口人"
            prop="sysBusinessCenterPersonList"
            readOnly
          >
            <p-input
              :value="
                (tempValue.sysBusinessCenterPersonList || [])
                  .map((d) => d.fdPersonName)
                  .join(',')
              "
              read-only
            />
          </p-form-model-item>
        </p-col>

        <!-- <p-row>
        <p-col :span="24">
          <p-form-model-item label="项目所在地" prop="projectSites">
            <site-list readOnly style="width: 100%" v-model="tempValue" />
          </p-form-model-item>
        </p-col>
      </p-row> -->

        <p-col :span="24">
          <p-form-model-item label="项目情况简介" prop="fdProjectDesc">
            <p-textarea
              v-model="tempValue.fdProjectDesc"
              :autoSize="{
                minRows: 4,
              }"
              read-only
            />
          </p-form-model-item>
        </p-col>
      </p-row>
    </block>

    <site-list readOnly style="margin-top: 16px" v-model="tempValue" />

    <block title="客户信息" style="margin-top: 16px" theme="primary">
      <p-row style="margin-top: 16px" :gutter="24">
        <p-col :span="8">
          <p-form-model-item label="项目方式" prop="fdProjectManner">
            <select-project-manner
              read-only
              :value="
                !!tempValue.fdProjectManner
                  ? [
                      {
                        value: tempValue.fdProjectManner,
                        text: tempValue.fdProjectManner,
                      },
                    ]
                  : []
              "
            />
          </p-form-model-item>
        </p-col>

        <template v-if="!!tempValue.fdProjectManner">
          <p-col :span="8">
            <p-form-model-item label="客户/代理商" prop="fdCustMainId">
              <p-input v-model="tempValue.fdCustName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
              <p-input v-model="tempValue.fdSapCustName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="一级渠道" prop="fdChannelOneName">
              <p-input v-model="tempValue.fdChannelOneName" read-only />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
              <p-input v-model="tempValue.fdChannelTwoName" read-only />
            </p-form-model-item>
          </p-col>
          <!-- <p-col :span="8">
            <p-form-model-item label="三级渠道" prop="fdChannelThreeName">
              <p-input v-model="tempValue.fdChannelThreeName" read-only />
            </p-form-model-item>
          </p-col> -->
          <p-col :span="8">
            <p-form-model-item
              label="终端客户名称"
              prop="fdTianyanchaName"
              v-if="tempValue.fdProjectManner === '代理商操作'"
            >
              <p-input v-model="tempValue.fdTianyanchaName" read-only />
            </p-form-model-item>
          </p-col>
        </template>
      </p-row>
    </block>

    <block title="其他信息" style="margin-top: 16px" theme="primary">
      <p-row style="margin-top: 16px" :gutter="24">
        <p-col :span="8">
          <p-form-model-item label="关联业务员" prop="fdLoginName">
            <p-input :value="tempValue.fdUserName" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="关联线索" prop="fdClueName">
            <p-input :value="tempValue.fdClueName" read-only />
          </p-form-model-item>
        </p-col>

        <p-col :span="24">
          <p-form-model-item label="团队其他成员" prop="sysDatascopePersonAspectParams">
            <p-input
              :value="
                tempValue.sysDatascopePersonAspectParams
                  .map((d) => d.fdPersonName)
                  .join(',')
              "
              read-only
            />
          </p-form-model-item>
        </p-col>

        <p-col :span="24">
          <p-form-model-item label="其他资料" prop="sysAttContractAspectParams">
            <uploader readOnly multiple v-model="tempValue.sysAttContractAspectParams" />
          </p-form-model-item>
        </p-col>
      </p-row>
    </block>
  </block>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import SelectProjectType from '../components/select/project-type';
import SelectProjectManner from '../components/select/project-manner';
import SelectCorporate from '@/views/components/select/corporate';
import SelectRate from '../components/select/rate';
import SiteList from '../ProjectEdit/site-list';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProjectTypeId: '',
    fdProjectTypeName: '',
    fdBusinessCode: '',
    fdCorporateCode: '',
    fdCorporateName: '',
    fdProjectManner: '',
  },
});

export default {
  name: 'project-info',
  mixins: [selectionMixin, formatMixin],
  components: {
    SelectProjectType,
    SelectCorporate,
    SelectProjectManner,
    SelectRate,
    SiteList,
    SelectYesOrNo,
  },
};
</script>
