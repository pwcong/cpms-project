import api from '@/api';

function getFormData() {
  return {
    id: '',
    fdIsValid: '1', // 是否有效 1：有效 0：无效
    fdName: '',
    typeStageConfigAddParams: [],
    sysDatascopeDeptAspectParams: [],
    sysDatascopePersonAspectParams: [],
  };
}

function getFormRules({}) {
  return {
    fdName: [
      {
        required: true,
        message: '请输入项目类型名称',
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
        path: `/Admin/ModuleManage/Project/ProjectTypeEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Admin/ModuleManage/Project/ProjectTypeCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Project/ProjectTypeDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.business.getProjectTypeDetail(id);
          this.formData = {
            ...this.formData,
            ...data,
            typeStageConfigAddParams: data.projectTypeStageConfigs || [],
            sysDatascopePersonAspectParams: data.sysDatascopePersonDtoList || [],
            sysDatascopeDeptAspectParams: data.sysDatascopeDeptDtos || [],
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
          await api.business.postProjectTypeForm({
            ...formData,
            type: 1,
            fdUpdateId: formData.id,
          });
        } else {
          await api.business.postProjectTypeForm(formData);
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
      const { typeStageConfigAddParams = [] } = formData;

      if (typeStageConfigAddParams.length <= 0) {
        this.$message.error('阶段信息不能为空');
        return false;
      }

      return true;
    },
  },
};
