export default {
  methods: {
    checkButton(record, name, property) {
      return !!(record[property || 'operationButtonList'] || []).find(
        (d) => d.operatingCode === name
      );
    },
  },
};
