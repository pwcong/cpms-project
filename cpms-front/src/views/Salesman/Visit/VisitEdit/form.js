import dayjs from 'dayjs';
import api from '@/api';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';

function getFormData() {
  return {
    fdVisitPlanBeginTime: '',
    fdVisitPlanEndTime: '',
    fdVisitPlanWeek: '',
    fdVisitPlanYear: '',
    fdVisitType: '',
    fdVisitWay: '',
    fdModuleType: '',
    fdModuleTypeId: '',
    fdVisitAddressId: '',
    fdVisitAddress: '',
    fdVisitName: '',
    fdVisitMobile: '',
    fdVisitJob: '',
    fdVisitPurpose: '',
    visitFeedbackListDtos: [],
    spersonVisitFeedbackList: undefined,
    clockRecordMainDtos: [],
  };
}

export function getModuleName(visitType) {
  switch (true) {
    case visitType === 'clue':
      return '线索';
    case visitType === 'cust':
      return '客户';
    case visitType === 'project':
      return '项目';
    default:
      return '模块';
  }
}

function getFormRules({ fdVisitType }) {
  return {
    fdVisitPlanWeek: [
      {
        required: true,
        message: '请选择计划拜访日期',
        trigger: 'change',
      },
    ],
    fdVisitType: [
      {
        required: true,
        message: '请选择拜访类型',
        trigger: 'change',
      },
    ],
    fdModuleType: [
      {
        required: true,
        message: `请选择${getModuleName(fdVisitType)}名称`,
        trigger: 'change',
      },
    ],
    fdVisitWay: [
      {
        required: true,
        message: '请选择拜访方式',
        trigger: 'change',
      },
    ],
    fdVisitAddress: [
      {
        required: true,
        message: '请选择办公地址',
        trigger: 'change',
      },
    ],
    fdVisitName: [
      {
        required: true,
        message: '请输入拜访人姓名',
        trigger: 'blur',
      },
    ],
    fdVisitMobile: [
      {
        required: true,
        message: '请输入拜访人电话',
        trigger: 'blur',
      },
    ],
    fdVisitPurpose: [
      {
        required: true,
        message: '请输入拜访目的',
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
      years: [],
      weeks: [],
      nowWeek: '1',
      nowYear: '2021',
    };
  },
  computed: {
    formRules() {
      return getFormRules(this.formData);
    },
    moduleName() {
      return getModuleName(this.formData.fdVisitType);
    },
  },
  methods: {
    handleCancel() {
      this.$router.back(true);
    },
    handleCreate() {
      this.$router.push({
        path: '/Salesman/Visit/VisitCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Salesman/Visit/VisitDetail/${id}`,
      });
    },
    handleEdit(id) {
      this.$router.push({
        path: `/Salesman/Visit/VisitEdit/${id}`,
      });
    },
    async loadAddress(id) {
      const { fdVisitType } = this.formData;

      this.formData.fdModuleTypeId = id;

      if (fdVisitType === 'clue') {
        const data = await api.clue.getClueDetail(id);
        console.log(data);

        this.formData.fdModuleType = data.fdClueName;
        this.address = (data.addressList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'project') {
        const data = await api.business.getProjectDetail(id);
        console.log(data);

        this.formData.fdModuleType = data.fdName;
        this.address = (data.addressListDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailAddress,
            value: d.id,
          }));
      } else if (fdVisitType === 'cust') {
        const data = await api.customer.getCustomerDetail(id);
        console.log(data);

        this.formData.fdModuleType = (data || {}).fdCustName;
        this.address = (data.addressDtoList || [])
          .filter((d) => d.fdIsValid !== '0')
          .map((d) => ({
            text: d.fdDetailaddress,
            value: d.id,
          }));
      }
    },
    async initFormData(id) {
      this.loading = true;

      const now = dayjs();
      const { weekNumber } = getWeekOfDate(now);

      this.nowWeek = `${weekNumber + 1}`;
      this.nowYear = `${now.year()}`;

      try {
        if (!!id) {
          const data = await api.salesman.getVisitDetail(id);
          this.formData = {
            ...this.formData,
            ...data,
            visitFeedbackListDtos: data.visitFeedbackListDtos || [],
            spersonVisitFeedbackList: data.spersonVisitFeedbackList,
            clockRecordMainDtos: data.clockRecordMainDtos || [],
          };

          if (this.formData.spersonVisitFeedbackList) {
            const fileList = await api.common
              .getFileList({
                attKey: 'SALESMAN_VISITFEEDBACK',
                moudleId: this.formData.spersonVisitFeedbackList.id,
              })
              .then((res) => res.data || []);

            this.formData.spersonVisitFeedbackList.sysAttContractAspectParams =
              fileList.map((d) => ({
                text: d.fdFileName,
                value: d.id,
                path: d.fdPath,
              }));
          }

          if (this.formData.clockRecordMainDtos.length > 0) {
            for (let i = 0, l = this.formData.clockRecordMainDtos.length; i < l; i++) {
              const t = this.formData.clockRecordMainDtos[i];

              const fl = await api.common
                .getFileList({
                  attKey: 'SALESMAN_VISITCLOCKIN',
                  moudleId: t.id,
                })
                .then((res) => res.data || []);
              t.sysAttContractAspectParams = fl.map((d) => ({
                text: d.fdFileName,
                value: d.id,
                path: d.fdPath,
              }));
            }
          }

          if (!!this.formData.fdModuleTypeId) {
            this.loadAddress(this.formData.fdModuleTypeId);
          }
        } else {
          this.formData = {
            ...this.formData,
            fdVisitPlanYear: `${now.year()}`,
            fdVisitPlanWeek: `${weekNumber + 1}`,
          };

          const { source, targetId } = this.$route.query;

          if (!!source && !!targetId) {
            if (source === 'project') {
              this.formData.fdVisitType = 'project';
              this.loadAddress(targetId);
            }
            if (source === 'customer') {
              this.formData.fdVisitType = 'cust';
              this.loadAddress(targetId);
            }
            if (source === 'clue') {
              this.formData.fdVisitType = 'clue';
              this.loadAddress(targetId);
            }
          }
        }
      } finally {
        this.loading = false;
      }
    },
    async submitFormData(formData, action) {
      this.loading = true;
      try {
        const { fdVisitPlanYear, fdVisitPlanWeek } = formData;
        const weeks = getWeeksOfYear(parseInt(fdVisitPlanYear));
        const week = weeks[parseInt(fdVisitPlanWeek) - 1];

        formData = {
          ...formData,
          fdName: formData.fdModuleType,
          fdVisitPlanBeginTime: week.start.valueOf(),
          fdVisitPlanEndTime: week.end.valueOf(),
        };
        // if (isEdit) {
        //   await api.salesman.putVisitForm(formData);
        // } else {
        //   await api.salesman.postVisitForm({
        //     ...formData,
        //     fdStatus: "todo",
        //   });
        // }
        switch (action) {
          case 'draft':
            await api.salesman.postVisitForm({
              ...formData,
              fdStatus: 'draft',
            });
            break;
          case 'add':
            await api.salesman.postVisitForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          case 'edit':
            await api.salesman.putVisitForm({
              ...formData,
              fdStatus: formData.fdStatus === 'draft' ? 'todo' : formData.fdStatus,
            });

            break;
          default:
            break;
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
      const { fdVisitPlanYear, fdVisitPlanWeek } = formData;

      if (
        fdVisitPlanYear < this.nowYear ||
        (fdVisitPlanYear === this.nowYear && fdVisitPlanWeek < this.nowWeek)
      ) {
        this.$message.error('不允许创建本周之前的拜访计划');
        return;
      }

      return true;
    },
  },
};
