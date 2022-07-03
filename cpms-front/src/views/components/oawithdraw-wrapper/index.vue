<template>
  <span class="oawithdraw-wrapper" @click="handleClick">
    <slot name="default" />
  </span>
</template>

<script>
import api from '@/api';

export default {
  name: 'oawithdraw-wrapper',
  props: {
    fdModuleId: {
      type: String,
      required: true,
    },
    fdModuleFlag: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '是否撤回单据?',
    },
  },
  methods: {
    handleClick() {
      this.$confirm({
        title: this.placeholder,
        onOk: async () => {
          await api.common.putWithdrawalWrapper({
            fdModuleId: this.fdModuleId,
            fdModuleFlag: this.fdModuleFlag,
          });
          this.$message.success(`单据撤回成功`);
          this.$emit('change', true);
        },
        onCancel: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
