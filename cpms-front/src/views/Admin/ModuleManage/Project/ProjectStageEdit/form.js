import api from '@/api';

function getFormData() {
  return {
    id: '',
    fdIsValid: '1', // 是否有效 1：有效 0：无效
    fdName: '',
    fdCompletePercentage: '',
    stageComponentConfigAddParams: [],
  };
}

function getFormRules({}) {
  return {
    fdName: [
      {
        required: true,
        message: '请输入项目阶段名称',
        trigger: 'blur',
      },
    ],
    fdCompletePercentage: [
      {
        required: true,
        message: '请输入默认完成比例',
        trigger: 'blur',
      },
    ],
  };
}

export default {
  data() {
    return {
      loading: false,
      formData: getFormData(),
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
  },
  methods: {
    handleCancel() {
      this.$router.back(true);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Project/ProjectStageEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Admin/ModuleManage/Project/ProjectStageCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Project/ProjectStageDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.business.getProjectStageDetail(id);
          this.formData = {
            ...data,
            stageComponentConfigAddParams: data.projectStageComponentConfigs || [],
          };
        } else {
          // TODO 新建初始化数据
        }
      } finally {
        this.loading = false;
      }
    },
    async submitFormData(formData, isEdit) {
      this.loading = true;

      try {
        if (isEdit) {
          await api.business.putProjectStageForm(formData);
        } else {
          await api.business.postProjectStageForm(formData);
        }
        this.$message.success('表单提交成功');
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
      // const { stageComponentConfigAddParams = [] } = formData;

      // if (stageComponentConfigAddParams.length <= 0) {
      //   this.$message.error("组件信息不能为空");
      //   return false;
      // }

      // if (
      //   !stageComponentConfigAddParams.every((d, i) => d.fdSortNum === i + 1)
      // ) {
      //   this.$message.error("组件信息序号有误");
      //   return false;
      // }

      return true;
    },
  },
};
