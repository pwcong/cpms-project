<template>
  <span class="oasubmit-wrapper" @click="handleClick">
    <slot name="default" />
    <setting-oa :status="status" :statusMap="statusMap" :visible.sync="settingVisible" @change="handleSubmit" />
  </span>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import mixin, { EStatus } from './mixin';
import SettingOA from './setting-oa';

const reqMixin = buildListMixin({
  relation: ['moduleId', 'moduleFlag'],
  getData: async (_) => {
    if (!!_.moduleId && !!_.moduleFlag) {
      const data = await api.common.getAuditInfo({
        fdModuleFlag: _.moduleFlag,
        fdModuleId: _.moduleId,
      });
      _.processUrl = data.url;
    }

    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  name: 'oasubmit-wrapper',
  mixins: [mixin, reqMixin],
  props: {
    moduleId: {
      type: String,
    },
    moduleFlag: {
      type: String,
    },
    beforeSubmit: {
      type: Function,
      default: () => Promise.resolve(true),
    },
  },
  components: {
    'setting-oa': SettingOA,
  },
  data() {
    return {
      settingVisible: false,
      processUrl: '',
    };
  },
  methods: {
    async handleClick() {
      try {
        const checked = await this.beforeSubmit();

        if (!checked) {
          return;
        }

        if ([this.statusMap[EStatus.draft], this.statusMap[EStatus.reject]].indexOf(this.status) > -1) {
          if (!this.processUrl) {
            this.$emit('submit', {});
            return;
          }

          this.settingVisible = true;
        } else {
          this.$emit('submit', {});
        }
      } finally {
        // DO NOTHING
      }
    },
    handleSubmit(value) {
      this.$emit('submit', value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
