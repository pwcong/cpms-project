export default {
  methods: {
    getDocumentBody() {
      return document.body;
    },
    checkButton(record, name) {
      return !!(record.operationButtonList || []).find((d) => d.operatingCode === name);
    },
  },
};
