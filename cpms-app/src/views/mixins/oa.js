import api from '@/api';
export default {
  methods: {
    handleOAWithdraw(fdModuleId, fdModuleFlag) {
      this.$dialog
        .confirm({
          message: '是否撤回单据?',
        })
        .then(async () => {
          await api.common.putWithdrawalWrapper({
            fdModuleId: fdModuleId,
            fdModuleFlag: fdModuleFlag,
          });

          this.$toast.success('单据撤回成功');

          this.$emit('change');
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
