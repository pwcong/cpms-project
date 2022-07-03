import dayjs from 'dayjs';
import wNumb from 'wnumb';

const format = wNumb({
  prefix: '¥ ',
  decimals: 2,
  thousand: ',',
});

export default {
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
