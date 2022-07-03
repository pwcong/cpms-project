import api from '@/api';
import dayjs from 'dayjs';
import { userMixin } from '@/mixins';

function getFormData() {
  return {
    fdLoginName: '',
    fdUserName: '',
    fdDeptName: '',
    fdDeptCode: '',
    fdUserPhone: '',
    createTime: '',
    fdCorporateCode: '',
    fdCorporateName: '',
    fdSealType: '',
    fdProjectMainId: '',
    fdProjectName: '',
    fdCustId: '',
    fdCustName: '',
    fdBeginTime: '',
    fdEndTime: '',
    fdStatus: 'todo',
    fdProductLineCode: '',
    fdProductLineName: '',
    fdProductLineList: [],
    fdReasonSummary: '',
    fdLeaderList: [],
    fdAuditorList: [],
    fdManagerList: [],
    updateBy: '',
    createTime: '',
    updateTime: '',
    createBy: '',
    createByName: '',
    updateByName: '',
    sysAttContractAspectParams: [],
  };
}

function getFormRules({}) {
  return {
    fdLoginName: [
      {
        required: true,
        message: '请输入填单人姓名',
        trigger: 'blur',
      },
    ],
    fdDeptName: [
      {
        required: true,
        message: '请输入填单人部门',
        trigger: 'blur',
      },
    ],
    fdUserPhone: [
      {
        required: true,
        message: '请输入填单人电话',
        trigger: 'blur',
      },
    ],
    createTime: [
      {
        required: true,
        message: '请选择填单时间',
        trigger: 'change',
      },
    ],
    fdCorporateCode: [
      {
        required: true,
        message: '请选择盖章法人',
        trigger: 'change',
      },
    ],
    fdSealType: [
      {
        required: true,
        message: '请选择盖章类型',
        trigger: 'change',
      },
    ],
    fdProjectMainId: [
      {
        required: true,
        message: '请选择项目名称',
        trigger: 'change',
      },
    ],
    fdCustName: [
      {
        required: true,
        message: '请选择被授权代理商名称',
        trigger: 'change',
      },
    ],
    fdBeginTime: [
      {
        required: true,
        message: '请选择开始的授权时间',
        trigger: 'change',
      },
    ],
    fdEndTime: [
      {
        required: true,
        message: '请选择结束的授权时间',
        trigger: 'change',
      },
    ],
    fdLeaderList: [
      {
        required: true,
        message: '请选择直管/分部领导',
        trigger: 'change',
      },
    ],
    fdManagerList: [
      {
        required: true,
        message: '请选择一级部门/业务中心负责人',
        trigger: 'change',
      },
    ],
    // sysAttContractAspectParams: [
    //   {
    //     required: true,
    //     message: "请上传合同附件",
    //     trigger: "change",
    //   },
    // ],
  };
}

export default {
  mixins: [userMixin],
  data() {
    const { source, targetId } = this.$route.query;
    return {
      loading: false,
      formData: getFormData(),
      source,
      targetId,
      attKey: 'BUSINESS_GRANT',
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
  },
  methods: {
    // 跳转新增页
    handleCreate() {
      this.$router.push({
        path: '/Business/Grant/GrantCreate',
      });
    },
    // 跳转详情页
    handleDetail(id) {
      this.$router.push({
        path: `/Business/Grant/GrantDetail/${id}`,
      });
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Business/Grant/GrantEdit/${id}`,
      });
    },
    handleCancel() {
      this.$router.back(true);
    },
    getOnlyProductLine(arr) {
      const cache = {};
      return arr.filter((d) => {
        if (cache[d.fdProductLineName]) {
          return false;
        }
        cache[d.fdProductLineName] = true;
        return true;
      });
    },
    async loadProject(id) {
      const projectDetailInfo = await api.business.getProjectDetail(id);
      let projectProductList = await api.business
        .getProjectProductList({
          fdMainId: id,
          pageNo: 1,
          limit: 999,
        })
        .then((res) =>
          (res.data || []).filter((d) => d.fdProductCategoryCode !== '完全定制化')
        );

      projectProductList = projectProductList.filter(
        (d, i) =>
          projectProductList.findIndex(
            (_d) => d.fdProductLineCode === _d.fdProductLineCode
          ) === i
      );

      this.formData = {
        ...this.formData,
        fdProjectMainId: id,
        fdProjectName: projectDetailInfo.fdName,
        fdCustId: projectDetailInfo.fdCustMainId,
        fdCustName: projectDetailInfo.fdCustName,
        // fdTianyanchaMainId:projectDetailInfo.fdTianyanchaMainId,
        // fdTianyanchaName:projectDetailInfo.fdTianyanchaName,
        fdProductLineList: this.getOnlyProductLine(
          projectDetailInfo.projectProductListDtoList
        ),
        fdCorporateCode: projectDetailInfo.fdCorporateCode,
        fdCorporateName: projectDetailInfo.fdCorporateName,
      };
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.grant.getProjectGrantDetail(id);

          this.formData = {
            ...this.formData,
            ...data,
            fdLeaderList: data.fdLeaderList || [],
            fdAuditorList: data.fdAuditorList || [],
            fdManagerList: data.fdManagerList || [],
          };
          const attr = await api.common
            .getFileList({
              attKey: this.attKey,
              moudleId: id,
            })
            .then((res) => res.data);

          this.formData.sysAttContractAspectParams = attr.map((d) => ({
            value: d.id,
            text: d.fdFileName,
            path: d.fdPath,
          }));
        } else {
          this.formData = {
            ...this.formData,
            fdLoginName: this.user.uid,
            fdUserName: this.user.name,
            fdDeptName: this.userInfo.companyName,
            fdDeptCode: this.userInfo.companyNumber,
            fdUserPhone: this.userInfo.mobile,
            createTime: dayjs().format('YYYY-MM-DD'),
          };
          if (!!this.source && !!this.targetId) {
            if (this.source === 'project') {
              await this.loadProject(this.targetId);
            }
          }
        }
      } finally {
        this.loading = false;
      }
    },
    async submitFormData(formData, action) {
      this.loading = true;
      formData = {
        ...formData,
        fdAttKey: this.attKey,
        sysAttContractAspectParams: this.formData.sysAttContractAspectParams.map((d) => ({
          fdAttFileId: d.value,
          fdAttKey: this.attKey,
        })),
      };
      try {
        // if (isEdit) {
        //   await api.grant.putProjectGrantForm({
        //     ...formData
        //   })
        // } else {
        //   await api.grant.postProjectGrantForm({
        //     ...formData
        //   })
        // }
        switch (action) {
          case 'draft':
            await api.grant.postProjectGrantForm({
              ...formData,
              mainId: formData.id,
              fdStatus: 'draft',
            });
            break;
          case 'reject':
            await api.grant.postProjectGrantForm({
              ...formData,
              mainId: formData.id,
              fdStatus: 'reject',
            });
            break;
          case 'add':
            await api.grant.postProjectGrantForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          case 'edit':
            if (formData.fdStatus === 'draft') {
              await api.grant.postProjectGrantForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else if (formData.fdStatus === 'reject') {
              await api.grant.postProjectGrantForm({
                ...formData,
                fdStatus: 'todo',
              });
            } else {
              await api.grant.putProjectGrantForm(formData);
            }

            break;
          default:
            break;
        }
        this.$message.success('表单提交成功');
        setTimeout(() => {
          this.$router.back(true);
        }, 300);
      } finally {
        this.loading = false;
      }
    },
    checkFormData(formData) {
      if (formData.fdBeginTime > formData.fdEndTime) {
        this.$message.error('授权开始时间不能大于授权截止时间');
        return;
      }
      return true;
    },
  },
};
