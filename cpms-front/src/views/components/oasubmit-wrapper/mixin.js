export const EStatus = {
  draft: 'draft',
  reject: 'reject',
};

export default {
  props: {
    status: {
      type: String,
    },
    statusMap: {
      type: Object,
      default: () => ({
        [EStatus.draft]: 'draft',
        [EStatus.reject]: 'reject',
      }),
    },
  },
};
