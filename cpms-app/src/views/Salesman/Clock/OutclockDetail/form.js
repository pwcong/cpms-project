import api from '@/api';
import dayjs from 'dayjs';

function getFormData() {
  return {
    fdUserName: '',
    fdDeptName: '',
    fdJobNumber: '',
    address: '',
    fdRelateModule: '',
    fdClockTimeParam: '',
    fdCause: '',
    sysAttContractAspectParams: [],
  };
}

function getFormRules({}) {
  return {
    fdUserName: [
      {
        required: true,
        message: '请输入申请人',
        trigger: 'blur',
      },
    ],
    fdJobNumber: [
      {
        required: true,
        message: '请输入申请人工号',
        trigger: 'blur',
      },
    ],
    fdDeptName: [
      {
        required: true,
        message: '请选择申请人部门',
        trigger: 'blur',
      },
    ],
    address: [
      {
        required: true,
        message: '请选择打卡地点',
        trigger: 'blur',
      },
    ],
    fdRelateModule: [
      {
        required: true,
        message: '请选择关联拜访计划',
        trigger: 'blur',
      },
    ],
    outclockcardtime: [
      {
        required: true,
        message: '请选择打卡时间',
        trigger: 'blur',
      },
    ],
    outclockwhy: [
      {
        required: true,
        message: '请选择打卡理由',
        trigger: 'blur',
      },
    ],
    outclockpicture: [
      {
        required: true,
        message: '请选择图片',
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
      attKey: 'SALESMAN_EXTERNALCLOCKIN',
    };
  },
  computed: {
    formRules() {
      return getFormRules({});
    },
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleCreate() {
      this.$router.push({
        path: '/Salesman/Clock/ExternalClockIn',
      });
    },
    async initFormData(id) {
      if (!!id) {
        const data = await api.salesman.getOutclockDetail(id);

        const fileList = await api.common
          .getFileList({
            attKey: this.attKey,
            moudleId: id,
          })
          .then((res) => res.data || []);

        this.formData = {
          ...data,
          ...(data.spersonClockRecordMainDto || {}),
          sysAttContractAspectParams: fileList.map((d) => ({
            text: d.fdFileName,
            value: d.id,
            path: d.fdPath,
          })),
        };
      } else {
        this.formData = {
          ...this.formData,
          fdClockTimeParam: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
      }
    },
    async submitFormData(formData, isEdit) {
      this.loading = true;

      try {
        formData = {
          ...formData,
          fdType: 'clock',
        };
        if (isEdit) {
          await api.salesman.putClockForm(formData);
        } else {
          await api.salesman.postClockForm(formData);
        }
        this.$message.success('表单提交成功');
        setTimeout(() => {
          this.$router.back();
        }, 300);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.loading = false;
      }
    },
    checkFormData(formData) {
      return true;
    },
  },
};
