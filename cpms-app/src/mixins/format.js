import dayjs from 'dayjs';
import wNumb from 'wnumb';

export const CALENDAR_MIN_DATE = new Date(2000, 0, 1);
export const CALENDAR_MAX_DATE = new Date(dayjs().year() + 10, 11, 31);

const format = wNumb({
  prefix: '¥ ',
  decimals: 2,
  thousand: ',',
});

export default {
  data() {
    return {
      CALENDAR_MIN_DATE,
      CALENDAR_MAX_DATE,
    };
  },
  methods: {
    formatDateTime(v) {
      if (!v) {
        return;
      }

      if (typeof v === 'string') {
        return v;
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDate(v) {
      if (!v) {
        return;
      }

      if (typeof v === 'string') {
        return v;
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD ');
    },
    getAmount(value) {
      return Number((value || 0).toFixed(2));
    },
    formatAmount(value) {
      return format.to(Number(value) || 0);
    },
  },
};
