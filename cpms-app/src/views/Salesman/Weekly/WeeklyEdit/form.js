import dayjs from 'dayjs';
import api from '@/api';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';

function getFormData() {
  return {
    fdYear: '',
    fdWeek: '',
    fdBeginTime: '',
    fdEndTime: '',
    fdMonthPerformance: '',
    fdWeeklySituation: '',
    fdProjectProgress: '',
    fdNeedHelp: '',
    fdNextweekEvents: '',
    planCount: undefined,
    feedbackCount: undefined,
    percentage: undefined,
    projectCount: undefined,
    custCount: undefined,
    monday: undefined,
    tuesday: undefined,
    wednesday: undefined,
    thursday: undefined,
    friday: undefined,
    saturday: undefined,
    sunday: undefined,
    visitList: [],
    salesLists: [],
    selfLists: [],
  };
}

function getFormRules({}) {
  return {
    fdWeek: [
      {
        required: true,
        message: '请选择所在周',
        trigger: 'change',
      },
    ],
    fdMonthPerformance: [
      {
        required: true,
        message: '请输入本周重点工作完成情况',
        trigger: 'blur',
      },
    ],
    fdWeeklySituation: [
      {
        required: true,
        message: '请输入本周目标达成情况',
        trigger: 'blur',
      },
    ],
    fdProjectProgress: [
      {
        required: true,
        message: '请输入重大项目进展',
        trigger: 'blur',
      },
    ],
    fdNeedHelp: [
      {
        required: true,
        message: '请输入所需支持',
        trigger: 'blur',
      },
    ],
    fdNextweekEvents: [
      {
        required: true,
        message: '请输入下周重点工作事项',
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
        path: `/Salesman/Weekly/WeeklyEdit/${id}`,
      });
    },
    handleCreate() {
      this.$router.push({
        path: '/Salesman/Weekly/WeeklyCreate',
      });
    },
    handleDetail(id) {
      this.$router.push({
        path: `/Salesman/Weekly/WeeklyDetail/${id}`,
      });
    },
    async initFormData(id) {
      this.loading = true;

      try {
        if (!!id) {
          const res = await api.salesman.getWeeklyDetail(id);
          this.formData = {
            ...res,
            visitList: res.visitMain || [],
            salesLists: res.salesLists || [],
            selfLists: res.selfLists || [],
          };
        } else {
          const now = dayjs();
          const { weekNumber } = getWeekOfDate(now);

          const fdYear = `${now.year()}`;
          const fdWeek = `${weekNumber + 1}`;

          this.formData = {
            ...this.formData,
            fdYear,
            fdWeek,
          };

          this.initWeekData(now.year(), weekNumber + 1);
        }
      } finally {
        this.loading = false;
      }
    },
    async initWeekData(year, weekNumber) {
      const weeks = getWeeksOfYear(parseInt(year));
      const week = weeks[parseInt(weekNumber) - 1];

      const fdBeginTime = `${week.start.format('YYYY-MM-DD')} 00:00:00`;
      const fdEndTime = `${week.end.format('YYYY-MM-DD')} 23:59:59`;

      const weekData = await api.salesman.getWeeklyData({
        fdBeginTimeParam: fdBeginTime,
        fdEndTimeParam: fdEndTime,
      });

      this.formData = {
        ...this.formData,
        planCount: weekData.planCount,
        feedbackCount: weekData.feedbackCount,
        percentage: weekData.percentage,
        projectCount: weekData.projectCount,
        custCount: weekData.custCount,
        monday: weekData.monday,
        tuesday: weekData.tuesday,
        wednesday: weekData.wednesday,
        thursday: weekData.thursday,
        friday: weekData.friday,
        saturday: weekData.saturday,
        sunday: weekData.sunday,
        fdBeginTime,
        fdBeginTime,
        fdEndTime,
        visitList: weekData.visitMain || [],
      };
    },
    async submitFormData(formData, action) {
      this.loading = true;

      const { fdYear, fdWeek, visitList, visitMain } = formData;
      const weeks = getWeeksOfYear(parseInt(fdYear));
      const week = weeks[parseInt(fdWeek) - 1];

      let fdNextYear = fdYear;
      let fdNextWeek = `${parseInt(fdWeek) + 1}`;
      const nextWeek = weeks[parseInt(fdWeek)];
      if (!nextWeek) {
        fdNextYear = `${parseInt(fdYear) + 1}`;
        fdNextWeek = '1';
      }

      formData = {
        ...formData,
        fdNextYear,
        fdNextWeek,
        fdBeginTime: `${week.start.format('YYYY-MM-DD')} 00:00:00`,
        fdEndTime: `${week.end.format('YYYY-MM-DD')} 23:59:59`,
        salesLists: (formData.salesLists || []).map((d) => ({
          ...d,
          fdMonth: Number(d.fdMonth),
          fdSalesTask: Number(d.fdSalesTask),
          fdRealizedIncome: Number(d.fdRealizedIncome),
        })),
        selfLists: (formData.selfLists || []).map((d) => ({
          ...d,
          fdRealizedIncome: Number(d.fdRealizedIncome),
        })),
      };

      try {
        switch (action) {
          case 'draft':
            await api.salesman.postWeeklyForm({
              ...formData,
              fdStatus: 'draft',
            });
            break;
          case 'edit':
            if (formData.fdStatus === 'draft') {
              for (let i = 0; i < visitList.length; i++) {
                visitList[i].fdStatus = 'todo';
              }
              for (let i = 0; i < visitMain.length; i++) {
                visitMain[i].fdStatus = 'todo';
              }
              await api.salesman.postWeeklyForm({
                ...formData,
                fdStatus: 'todo',
                visitList,
                visitMain,
              });
            } else {
              await api.salesman.postWeeklyForm(formData);
            }
            break;
          case 'add':
            await api.salesman.postWeeklyForm({
              ...formData,
              fdStatus: 'todo',
            });
            break;
          default:
            break;
        }
        this.$toast.success({
          message: '表单提交成功',
        });
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
