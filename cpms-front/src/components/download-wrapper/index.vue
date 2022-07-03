<template>
  <span class="download-wrapper" @click="handleClick">
    <slot name="default" />
  </span>
</template>

<script>
import http from 'poros/http';
import mimetype from 'mimetype-js';
import { downloadByLink } from '@/utils/file';

export default {
  name: 'download-wrapper',
  props: {
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    data: {
      type: String,
      default: () => ({}),
    },
    query: {
      type: String,
      default: () => ({}),
    },
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '是否确认下载文件?',
    },
  },
  methods: {
    handleClick() {
      this.$confirm({
        title: this.placeholder,
        onOk: () => {
          this.handleExport();
        },
        onCancel: () => {},
      });
    },
    async handleExport() {
      const type = mimetype.lookup(this.title);
      if (!type) {
        this.$message.error('当前文件不支持下载');
        return;
      }

      const remove = this.$message.loading('文件下载中', 0);

      try {
        const bytes = await http
          .request({
            url: this.url,
            method: this.method,
            data: this.data,
            params: this.query,
            responseType: 'blob',
          })
          .then((res) => {
            return res.data;
          });

        const blob = new Blob([bytes], {
          type,
        });
        const url = window.URL.createObjectURL(blob);
        downloadByLink(url, this.title);
        window.URL.revokeObjectURL(url);
      } finally {
        remove();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
