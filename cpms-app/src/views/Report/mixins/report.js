export default {
  props: {
    reportQuery: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatDateRange(v) {
      let stringTimeOne = v.substring(0, 11) + v.substring(v.length - 20);
      stringTimeOne = stringTimeOne.substring(0, 22);

      return stringTimeOne.replace(',', ' ~ ');
    },
  },
};
