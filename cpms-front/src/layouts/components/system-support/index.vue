<template>
  <p-popover placement="bottomRight">
    <template slot="content">
      <div class="system-support" style="width: 450px">
        <div class="system-support-tips">
          以下是运维人员信息，为了保证沟通结果不被遗漏，建议尽量通过T信进行反馈。
        </div>
        <div class="system-support-table" style="margin-top: 16px">
          <p-table
            rowKey="name"
            :columns="[
              {
                title: '姓名',
                dataIndex: 'name',
              },
              {
                title: '邮箱',
                dataIndex: 'email',
              },
              {
                title: '电话',
                dataIndex: 'phone',
              },
            ]"
            :data-source="list"
            bordered
            :pagination="false"
          />
        </div>
        <div class="system-support-action" style="margin-top: 8px">
          <!-- <download-wrapper
            url="https://acloud.tcl.com/minio/cpms/1400348711102148610.pptx"
            title="CPMS系统操作手册_v1.0.pptx"
          >
            <p-button-link>操作手册下载</p-button-link>
          </download-wrapper> -->
          <a href="https://pan.tcl.com/s/lYis5i9R4k" target="_blank">
            <p-button-link>操作手册下载</p-button-link>
          </a>
        </div>
      </div>
    </template>

    <div class="button">
      <p-icon class="button-icon" type="info-circle" />
      <span class="button-label"> 运维支持 </span>
    </div>
  </p-popover>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';

const listMixin = buildListMixin({
  properties: [],
  getData: (_) => {
    return api.common
      .getDictList({
        systemCode: 'cpms',
        dictCode: 'cpms_operator_list',
      })
      .then((res) => ({
        ...res,
        data: (res.data || []).map((d) => {
          const v = (d.dataLabel || '').split(';');
          return {
            ...d,
            name: v[0],
            email: v[1],
            phone: v[2],
          };
        }),
      }));
  },
});

export default {
  name: 'system-support',
  mixins: [listMixin],
};
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
  }

  &-icon {
    font-size: 14px;
  }
  &-label {
    margin-left: 5px;
  }
}
</style>
