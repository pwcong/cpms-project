import api from '@/api';
import { getModuleName } from '../VisitEdit/form';

function getFormData() {
  return {
    fdMainId: '',
    fdName: '',
    fdVisitFeedbackType: '',
    fdModuleType: '',
    fdModuleTypeId: '',
    fdVisitName: '',
    fdVisitMobile: '',
    fdVisitJob: '',
    fdProjectFeedback: '',
    custList: [],
    sysAttContractAspectParams: [],
  };
}

function getFormRules({}) {
  return {
    fdVisitName: [
      {
        required: true,
        message: '请输入实际拜访人姓名',
        trigger: 'blur',
      },
    ],
    fdVisitMobile: [
      {
        required: true,
        message: '请输入实际拜访人电话',
        trigger: 'blur',
      },
    ],
    fdVisitJob: [
      {
        required: true,
        message: '请输入实际拜访人职务',
        trigger: 'blur',
      },
    ],
    fdProjectFeedback: [
      {
        required: true,
        message: '请输入反馈内容',
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
      attKey: 'SALESMAN_VISITFEEDBACK',
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
    moduleName() {
      return getModuleName(this.formData.fdVisitFeedbackType);
    },
  },
  methods: {
    async initFormData(id) {
      this.loading = true;
      try {
        if (!!id) {
          const data = await api.salesman.getVisitFeedbackDetail(id);

          const fileList = await api.common
            .getFileList({
              attKey: this.attKey,
              moudleId: id,
            })
            .then((res) => res.data || []);

          this.formData = {
            ...this.formData,
            ...data,
            sysAttContractAspectParams: fileList.map((d) => ({
              text: d.fdFileName,
              value: d.id,
              path: d.fdPath,
            })),
            custList: data.custVisitDto || [],
          };
        } else {
          const { visitId } = this.$route.query;
          const data = await api.salesman.getVisitDetail(visitId);

          this.formData = {
            ...this.formData,
            fdMainId: visitId,
            fdName: data.fdName,
            fdModuleType: data.fdModuleType,
            fdModuleTypeId: data.fdModuleTypeId,
            fdVisitName: data.fdVisitName,
            fdVisitMobile: data.fdVisitMobile,
            fdVisitJob: data.fdVisitJob,
            fdVisitFeedbackType: data.fdVisitType,
            fdAddress: data.fdVisitAddress,
          };
        }
      } finally {
        this.loading = false;
      }
    },
    async submitFormData(formData, isEdit) {
      this.loading = true;
      try {
        formData = {
          ...formData,
          sysAttContractAspectParams: formData.sysAttContractAspectParams.map((d) => ({
            fdAttKey: this.attKey,
            fdAttFileId: d.value,
          })),
          fdAttKey: this.attKey,
        };
        if (isEdit) {
          await api.salesman.putVisitFeedbackForm(formData);
        } else {
          await api.salesman.postVisitFeedbackForm(formData);
        }
        this.$toast.success({
          message: '表单提交成功',
        });
        setTimeout(() => {
          this.$router.back(true);
        }, 300);
      } catch (e) {
        // DO NOTHING
      } finally {
        this.loading = false;
      }
    },
    checkFormData(formData) {
      return true;
    },
  },
};
