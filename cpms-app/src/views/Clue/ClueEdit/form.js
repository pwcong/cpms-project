import api from '@/api';
import { userMixin } from '@/mixins';

function getFormData() {
  return {
    id: '',
    fdClueName: '',
    fdClueDescription: '',
    fdTerminalClient: '',
    fdClientId: '',
    fdClientUnifiedCode: '',
    fdEnterpriseIdL: '',
    fdClueSource: '',
    fdClueContactName: '',
    fdClueContactMobile: '',
    fdProvinceCode: '',
    fdProvinceName: '',
    fdCityCode: '',
    fdCityName: '',
    fdAgencyCode: '',
    fdAgencyName: '',
    productLineList: [],
    fdClueType: '',
    fdClueTypeName: '',
    fdLoginName: '',
    fdUserName: '',
    fdCustName: '',
    fdCustMainId: '',
    fdCustUnifiedCode: '',
    sysDatascopeDeptAspectParams: [],
    sysDatascopePersonAspectParams: [],
    fdCustIndustry: '',
    fdCompanyType: '',
    fdCustContactMobile: '',
    fdCustContactPhone: '',
    fdCompanyWeb: '',
    fdCompanyRegtime: '',
    fdTotalCount: 0,
    fdPurchaseAmount: '',
    fdSalesVolumeint: '',
    fdBrand: '',
    fdKeyDept: '',
    fdUserCommunity: '',
    otherContactsList: [],
    addressList: [],
    fdClueStatus: 'todo',
    clueActionList: [],

    followUpPecordList: [],
    modifyRecordList: [],

    fdRegCapital: '',
    fdRegStatus: '',
    fdOtherRemark: '',
    fdBiddingNumber: '',
  };
}
function getFormRules({}) {
  return {
    fdClueName: [
      {
        required: true,
        message: '请输入线索名称',
        trigger: 'blur',
      },
    ],
    fdClueDescription: [
      {
        required: true,
        message: '请输入线索描述',
        trigger: 'blur',
      },
    ],
    fdClueType: [
      {
        required: true,
        message: '请选择线索类型',
        trigger: 'change',
      },
    ],
    fdClueSource: [
      {
        required: true,
        message: '请选择线索来源',
        trigger: 'change',
      },
    ],
    fdProvinceCode: [
      {
        required: true,
        message: '请选择所属区域',
        trigger: 'change',
      },
    ],
  };
}

export default {
  mixins: [userMixin],
  data() {
    return {
      loading: false,
      formData: getFormData(),
    };
  },
  methods: {
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.clue.getClueDetail(id);

          this.formData = {
            ...this.formData,
            ...data,
            productLineList: data.clueProductLineList || [],
            otherContactsList: data.otherContacts || [],
            clueActionList: data.clueActionList || [],
            // fdPurchaseAmount: this.formData.fdPurchaseAmount.toFixed(2),
            // fdSalesVolumeint: this.formData.fdSalesVolumeint.toFixed(2),
          };
        } else {
          //获取当前登陆人部门
          const dept = await api.clue.getDepartments();
          //拿到B2B业务中心机构信息
          const organization = await api.clue.getAffiliations();
          this.formData = {
            ...this.formData,
            fdUserName: this.user.name,
            fdLoginName: this.user.uid,

            // fdAgencyCode:"90009555/dz90009555",
            fdAgencyCode: (organization.records[0] || {}).fdCode,
            fdAgencyName: (organization.records[0] || {}).fdName,

            sysDatascopeDeptAspectParams: (dept.orgPosDtos || []).map((d) => ({
              fdDeptId: d.orgCode,
              fdDeptName: d.orgName,
            })),
          };
        }
      } finally {
        this.loading = false;
      }
    },

    async submitFormData(formData, action) {
      this.loading = true;

      try {
        // if (isEdit) {
        //   await api.clue.putClueForm(formData);
        // } else {
        //   await api.clue.postClueForm(formData);
        // }
        switch (action) {
          case 'draft':
            await api.clue.postClueForm({
              ...formData,
              mainId: formData.id,
              fdClueStatus: 'draft',
            });
            break;
          case 'add':
            await api.clue.postClueForm({
              ...formData,
              fdClueStatus: 'todo',
            });
            break;
          case 'edit':
            if (formData.fdClueStatus === 'draft') {
              await api.clue.postClueForm({
                ...formData,
                fdClueStatus: formData.fdClueStatus === 'draft' ? 'todo' : formData.fdClueStatus,
              });
            } else {
              await api.clue.putClueForm(formData);
            }

            break;
          default:
            break;
        }
        this.$toast.success('请求成功');
        setTimeout(() => {
          this.$router.back(true);
        }, 300);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    checkFormData(formData) {
      return true;
    },
    // handleCancel() {
    //   this.$root.goBack();
    // },
    handleCancel(needConfirm) {
      if (needConfirm === true) {
        this.$dialog
          .confirm({
            title: '当前内容未保存，是否确认返回?',
          })
          .then(() => {
            //退出
            this.$root.goBack();
          });
      } else {
        this.$root.goBack();
      }
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Clue/ClueEdit/${id}`,
      });
    },
    //跳转详情页
    handleDetail(id, query) {
      this.$router.push({
        path: `/Clue/ClueDetail/${id}`,
        query,
      });
    },
    // 跳转新增页
    handleCreate() {
      this.$router.push({
        path: '/Clue/ClueCreate',
      });
    },
  },
};
