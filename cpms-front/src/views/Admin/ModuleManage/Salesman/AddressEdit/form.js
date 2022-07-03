import api from '@/api';
function getFormData() {
  return {
    id: '',
    fdClockAddressAcronym: '',
    fdClockAddress: '',
    fdDeptCode: '',
    fdClockScope: '',
    sysDatascopePersonAspectParams: [],
    sysDatascopeDeptAspectParams: [],
    fdIsValid: '1',
  };
}

function getFormRules({}) {
  return {
    fdClockAddressAcronym: [
      {
        required: true,
        message: '请输入打卡地址缩写',
        trigger: 'blur',
      },
    ],
    fdClockAddress: [
      {
        required: true,
        message: '请输入打卡地址',
        trigger: 'blur',
      },
    ],
    fdClockScope: [
      {
        required: true,
        message: '请输入打卡有效范围',
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
    handleCreate() {
      this.$router.push({
        path: '/Admin/ModuleManage/Salesman/AddressCreate',
      });
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Salesman/AddressEdit/${id}`,
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Admin/ModuleManage/Salesman/AddressDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const data = await api.salesman.getClockAddressDetail(id);
          this.formData = {
            ...this.formData,
            ...data,
            sysDatascopePersonAspectParams: (
              data.sysDatascopePersonAspectParams || []
            ).map((d) => ({
              uid: d.fdPersonId,
              name: d.fdPersonName,
            })),
            sysDatascopeDeptAspectParams: (data.sysDatascopeDeptAspectParams || []).map(
              (d) => ({
                code: d.fdDeptId,
                name: d.fdDeptName,
              })
            ),
          };
        } else {
          // TODO 新建初始化数据
        }
      } finally {
        this.loading = false;
      }
    },
    async submitFormData(formData) {
      this.loading = true;
      try {
        formData = {
          ...formData,
          sysDatascopePersonAspectParams: formData.sysDatascopePersonAspectParams.map(
            (d, index) => ({
              fdPersonId: d.uid,
              fdPersonName: d.name,
              fdFieldFlag: 'addressConfig',
              fdAdcode: index,
            })
          ),
          sysDatascopeDeptAspectParams: formData.sysDatascopeDeptAspectParams.map(
            (d, index) => ({
              fdDeptId: d.code,
              fdDeptName: d.name,
              fdFieldFlag: 'addressConfig',
              fdAdcode: index,
            })
          ),
        };
        if (formData.id) {
          await api.salesman.putClockAddressForm(formData);
        } else {
          await api.salesman.postClockAddressForm(formData);
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
