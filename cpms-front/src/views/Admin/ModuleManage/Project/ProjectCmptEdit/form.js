import api from '@/api';

function getFormData() {
  return {
    id: '',
    fdName: '',
    fdType: '',
    fdTypeName: '',
    fdComponentId: '',
    fdPrompt: '',
    fdOtherPrompt: '',
    fdAttKey: '',
    fdProcessName: '',
    fdProcessId: '',
    fdDropDown: '',
    fdFieldLength: 200,
    fdIsMultipleChoice: '0',
  };
}

function getFormRules({ selectedType }) {
  return {
    fdName: [
      {
        required: true,
        message: '请输入组件名称',
        trigger: 'blur',
      },
    ],
    fdComponentId: [
      {
        required: true,
        message: '请输入组件ID',
        trigger: 'blur',
      },
    ],
    fdType: [
      {
        required: true,
        message: '请选择组件类型',
        trigger: 'change',
      },
    ],
    fdFieldLength: [
      {
        required: ['singleText', 'multipleText'].indexOf(selectedType) > -1,
        message: '请输入字段长度',
        trigger: 'blur',
      },
    ],
    fdPrompt: [
      {
        required: ['singleText', 'multipleText'].indexOf(selectedType) > -1,
        message: '请输入输入提示',
        trigger: 'blur',
      },
    ],
    fdOtherPrompt: [
      {
        required: ['singleText', 'multipleText', 'att'].indexOf(selectedType) > -1,
        message: '请输入其他提示',
        trigger: 'blur',
      },
    ],
    fdAttKey: [
      {
        required: ['att'].indexOf(selectedType) > -1,
        message: '请输入附件Key值',
        trigger: 'blur',
      },
    ],
    fdProcessId: [
      {
        required: ['process'].indexOf(selectedType) > -1,
        message: '请选择关联流程',
        trigger: 'blur',
      },
    ],
    fdDropDown: [
      {
        required: ['dropDown'].indexOf(selectedType) > -1,
        message: '请输入关联主数据字典关键字',
        trigger: 'blur',
      },
    ],
    fdDisplay: [
      {
        required: ['textDisplay'].indexOf(selectedType) > -1,
        message: '请输入要显示的文字',
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
      return getFormRules({
        selectedType: this.selectedType,
      });
    },
    selectedType() {
      return this.formData.fdType;
    },
  },
  methods: {
    handleCancel() {
      this.$router.back(true);
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Project/ProjectCmptEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Admin/ModuleManage/Project/ProjectCmptCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Project/ProjectCmptDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.business.getProjectComponentDetail(id);
          this.formData = {
            ...this.formData,
            ...data,
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
          await api.business.putProjectComponentForm(formData);
        } else {
          await api.business.postProjectComponentForm(formData);
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
      return true;
    },
  },
};
